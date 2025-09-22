import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, MapPin, X, Phone } from "lucide-react";
import { signupUser } from "../services/authService";

// Composants réutilisables
const InputWithIcon = ({ id, name, type, value, onChange, placeholder, icon: Icon, error, label }) => (
  <div>
    {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <div className="relative">
      {Icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icon className="h-5 w-5 text-gray-400" /></div>}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${error ? "border-red-500" : "border-gray-300"}`}
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-600 flex items-center"><X className="h-4 w-4 mr-1" />{error}</p>}
  </div>
);

const FileUploadButton = ({ label, name, onChange, error, fileName }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="flex w-full items-center">
      <label className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-l-lg cursor-pointer hover:bg-green-700 transition-all whitespace-nowrap">
        Choisir une image
        <input type="file" name={name} onChange={onChange} className="hidden" />
      </label>
      <input
        type="text"
        readOnly
        value={fileName || ""}
        placeholder="Aucun fichier sélectionné"
        className="flex-1 px-4 py-3 border rounded-r-lg border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-600 flex items-center"><X className="h-4 w-4 mr-1" />{error}</p>}
  </div>
);

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
    role: "",
    description: "",
    groupName: "",
    location: { address: "", city: "", region: "" },
    categories: [],
    acceptTerms: false,
    newsletter: false,
    profileImage: null,
    coverImage: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userTypes = [
    { id: "consumer", title: "Consommateur", detail: "Acheter des produits locaux" },
    { id: "producer", title: "Producteur", detail: "Vendre mes produits" },
  ];

  const regionsOfGuinea = ["Conakry","Boké","Faranah","Kankan","Kindia","Labé","Mamou","Nzérékoré"];
  const productCategories = ["Fruits", "Légumes", "Artisanat", "Boissons", "Épicerie"];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name.startsWith("location.")) {
      const key = name.split(".")[1];
      setFormData(prev => ({ ...prev, location: { ...prev.location, [key]: value } }));
    } else if (name === "categories") {
      setFormData(prev => {
        const current = prev.categories.includes(value)
          ? prev.categories.filter(c => c !== value)
          : [...prev.categories, value];
        return { ...prev, categories: current };
      });
    } else if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Le prénom est requis";
    if (!formData.lastName.trim()) newErrors.lastName = "Le nom est requis";
    if (!formData.email) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Format d'email invalide";
    if (!formData.telephone) newErrors.telephone = "Le téléphone est requis";
    else if (!/^\d{6,15}$/.test(formData.telephone)) newErrors.telephone = "Numéro invalide";
    if (!formData.role) newErrors.role = "Veuillez choisir un type de compte";
    if (!formData.password) newErrors.password = "Le mot de passe est requis";
    else if (formData.password.length < 8) newErrors.password = "8 caractères minimum";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirmation requise";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Mots de passe différents";
    if (!formData.location.address) newErrors["location.address"] = "Adresse requise";
    if (!formData.location.city) newErrors["location.city"] = "Ville requise";
    if (!formData.acceptTerms) newErrors.acceptTerms = "Vous devez accepter les conditions";
    if (!formData.profileImage) newErrors.profileImage = "Photo de profil requise";

    // Description obligatoire uniquement pour producteurs
    if (formData.role === "producer" && !formData.description.trim()) newErrors.description = "La description est requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = new FormData();
      const groupNameToSend =
      formData.role === "producer" && !formData.groupName.trim()
        ? formData.firstName.trim() + " " + formData.lastName.trim()
        : formData.groupName.trim();
      payload.append("name", formData.firstName.trim() + " " + formData.lastName.trim());
      payload.append("email", formData.email.trim());
      payload.append("telephone", formData.telephone.trim());
      payload.append("password", formData.password);
      payload.append("role", formData.role);
      payload.append("adresse", formData.location.address.trim());
      payload.append("ville", formData.location.city.trim());
      payload.append("region", formData.location.region);
      payload.append("bio", formData.description);
      payload.append("groupName", groupNameToSend);
      formData.categories.forEach(cat => payload.append("categories[]", cat));
      if (formData.profileImage) payload.append("avatar", formData.profileImage);
      if (formData.coverImage) payload.append("cover", formData.coverImage);

      await signupUser(payload);
      navigate(formData.role === "producer" ? "/dashboard-producer" : "/dashboard");
    } catch (error) {
      console.error("❌ Erreur API:", error);
      setErrors({ submit: error.message || "Erreur lors de l'inscription" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 pt-16">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 py-2 px-2 text-center text-white">
            <h1 className="text-2xl font-bold mb-2">Inscription</h1>
            <p className="text-green-100">Créer un compte</p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
            {errors.submit && (
              <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                <X className="h-5 w-5 mr-2" />{errors.submit}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputWithIcon id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange} placeholder="Prénom" label="Prénom *" icon={User} error={errors.firstName} />
              <InputWithIcon id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange} placeholder="Nom" label="Nom *" icon={User} error={errors.lastName} />
              <InputWithIcon id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" label="Email *" icon={Mail} error={errors.email} />
              <InputWithIcon id="telephone" name="telephone" type="tel" value={formData.telephone} onChange={handleChange} placeholder="Téléphone" label="Téléphone *" icon={Phone} error={errors.telephone} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <InputWithIcon id="location.address" name="location.address" type="text" value={formData.location.address} onChange={handleChange} placeholder="Adresse complète" label="Adresse *" icon={MapPin} error={errors["location.address"]} />
              <InputWithIcon id="location.city" name="location.city" type="text" value={formData.location.city} onChange={handleChange} placeholder="Ville" label="Ville *" icon={MapPin} error={errors["location.city"]} />
              <div>
                <label htmlFor="location.region" className="block text-sm font-medium text-gray-700 mb-1">Région (optionnel)</label>
                <select id="location.region" name="location.region" value={formData.location.region} onChange={handleChange} className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                  <option value="">Sélectionnez votre région</option>
                  {regionsOfGuinea.map(region => <option key={region} value={region}>{region}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Type de compte *</label>
                <select id="role" name="role" value={formData.role} onChange={handleChange} className={`block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.role ? "border-red-500" : "border-gray-300"}`}>
                  <option value="">Choisissez votre type de compte</option>
                  {userTypes.map(type => <option key={type.id} value={type.id}>{type.title} - {type.detail}</option>)}
                </select>
                {errors.role && <p className="mt-1 text-sm text-red-600 flex items-center"><X className="h-4 w-4 mr-1" />{errors.role}</p>}
              </div>
            </div>

            {formData.role === "producer" && (
              <>
                <InputWithIcon id="groupName" name="groupName" type="text" value={formData.groupName} onChange={handleChange} placeholder="Nom de votre entreprise / groupement" label="Nom du groupement / entreprise" />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description de votre activité *</label>
                  <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className={`block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none ${errors.description ? "border-red-500" : "border-gray-300"}`} placeholder="Décrivez votre activité, vos produits..." />
                  {errors.description && <p className="mt-1 text-sm text-red-600 flex items-center"><X className="h-4 w-4 mr-1" />{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégories de produits</label>
                  <div className="flex flex-wrap gap-2 overflow-x-auto py-2">
                    {productCategories.map(cat => (
                      <label key={cat} className="flex items-center space-x-2 px-3 py-1 border border-gray-300 rounded-full cursor-pointer hover:bg-green-50 whitespace-nowrap">
                        <input type="checkbox" name="categories" value={cat} checked={formData.categories.includes(cat)} onChange={handleChange} className="h-4 w-4 text-green-600 focus:ring-green-500" />
                        <span className="text-sm">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                  <input type={showPassword ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Minimum 8 caractères" className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.password ? "border-red-500" : "border-gray-300"}`} />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}</button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600 flex items-center"><X className="h-4 w-4 mr-1" />{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmation de mot de passe *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                  <input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirmez votre mot de passe" className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`} />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}</button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600 flex items-center"><X className="h-4 w-4 mr-1" />{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Upload images */}
            <div className="space-y-4 mt-2">
              <FileUploadButton label="Photo de profil *" name="profileImage" onChange={handleChange} error={errors.profileImage} fileName={formData.profileImage?.name} />
              {formData.role === "producer" && <FileUploadButton label="Photo de couverture" name="coverImage" onChange={handleChange} error={errors.coverImage} fileName={formData.coverImage?.name} />}
            </div>

            {/* Terms & Newsletter */}
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 justify-between mt-2">
              <div className="flex items-center space-x-2">
                <input id="acceptTerms" type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} className="h-5 w-5 text-green-600 focus:ring-green-500" />
                <label htmlFor="acceptTerms" className="text-sm text-gray-700">J'accepte les <Link to="/conditions" className="text-green-600 hover:text-green-500 font-medium">conditions d'utilisation</Link> *</label>
              </div>
              <div className="flex items-center space-x-2">
                <input id="newsletter" type="checkbox" name="newsletter" checked={formData.newsletter} onChange={handleChange} className="h-5 w-5 text-green-600 focus:ring-green-500" />
                <label htmlFor="newsletter" className="text-sm text-gray-700">Je souhaite recevoir la newsletter</label>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center justify-center mt-4">
              {loading ? "Création en cours..." : "Créer mon compte"}
            </button>
          </form>

          <div className="px-6 py-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">Déjà inscrit ? <Link to="/connexion" className="font-medium text-green-600 hover:text-green-500">Se connecter</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
