import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaCheckCircle, 
  FaUsers,
  FaRocket,
  FaInfoCircle,
  FaExclamationCircle
} from 'react-icons/fa';
import { RiSecurePaymentLine } from 'react-icons/ri';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const featureVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: (i) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5
    }
  })
};

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    nombre: '',
    apellidos: '',
    telefono: '',
    rol: 'ROLE_USER' // Default role with ROLE_ prefix
  });
  const [formErrors, setFormErrors] = useState({});
  const { register, error, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

    const validateForm = async () => {
    const errors = {};
    let isValid = true;
    
    // Validación de nombre
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es obligatorio';
      isValid = false;
    } else if (formData.nombre.trim().length < 2) {
      errors.nombre = 'El nombre debe tener al menos 2 caracteres';
      isValid = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombre.trim())) {
      errors.nombre = 'El nombre solo puede contener letras y espacios';
      isValid = false;
    }
    
    // Validación de apellidos
    if (!formData.apellidos.trim()) {
      errors.apellidos = 'Los apellidos son obligatorios';
      isValid = false;
    } else if (formData.apellidos.trim().length < 2) {
      errors.apellidos = 'Los apellidos deben tener al menos 2 caracteres';
      isValid = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.apellidos.trim())) {
      errors.apellidos = 'Los apellidos solo pueden contener letras y espacios';
      isValid = false;
    }
    
    // Validación de teléfono
    if (!formData.telefono.trim()) {
      errors.telefono = 'El teléfono es obligatorio';
      isValid = false;
    } else if (!/^[0-9]{9,15}$/.test(formData.telefono)) {
      errors.telefono = 'Ingrese un número de teléfono válido (9-15 dígitos)';
      isValid = false;
    }
    
    // Validación de email
    if (!formData.email.trim()) {
      errors.email = 'El correo electrónico es requerido';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Ingrese un correo electrónico válido';
      isValid = false;
    } else {
      // Verificar si el correo ya está registrado
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/usuarios/check-email?email=${encodeURIComponent(formData.email)}`);
        if (response.data.exists) {
          errors.email = 'Este correo electrónico ya está registrado';
          isValid = false;
        }
      } catch (error) {
        console.error('Error al verificar el correo:', error);
        // No marcamos error para no bloquear al usuario si falla la verificación
      }
    }
    
    // Validación de nombre de usuario
    if (!formData.username.trim()) {
      errors.username = 'El nombre de usuario es requerido';
      isValid = false;
    } else if (formData.username.length < 4) {
      errors.username = 'El nombre de usuario debe tener al menos 4 caracteres';
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Solo se permiten letras, números y guiones bajos';
      isValid = false;
    }
    
    // Validación de contraseña
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
      isValid = false;
    } else {
      if (formData.password.length < 8) {
        errors.password = 'La contraseña debe tener al menos 8 caracteres';
        isValid = false;
      }
      if (!/(?=.*[a-z])/.test(formData.password)) {
        errors.password = 'La contraseña debe contener al menos una minúscula';
        isValid = false;
      }
      if (!/(?=.*[A-Z])/.test(formData.password)) {
        errors.password = 'La contraseña debe contener al menos una mayúscula';
        isValid = false;
      }
      if (!/(?=.*[0-9])/.test(formData.password)) {
        errors.password = 'La contraseña debe contener al menos un número';
        isValid = false;
      }
      if (!/(?=.*[!@#$%^&*])/.test(formData.password)) {
        errors.password = 'La contraseña debe contener al menos un carácter especial (!@#$%^&*)';
        isValid = false;
      }
    }
    
    // Validación de confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }
    
    // Validación de rol
    if (!formData.rol) {
      errors.rol = 'El rol es obligatorio';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({}); // Limpiar errores previos
    
    try {
      const isValid = await validateForm();
      
      if (isValid) {
        const userData = {
          username: formData.username.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          nombre: formData.nombre.trim(),
          apellidos: formData.apellidos.trim(),
          telefono: formData.telefono.trim(),
          rol: formData.rol
        };
        
        const success = await register(userData);
        
        if (success) {
          toast.success('¡Registro exitoso! Redirigiendo al inicio de sesión...', {
            duration: 3000,
            position: 'top-center',
            style: {
              background: '#10B981',
              color: '#fff',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }
          });
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } else {
        // Desplazarse al primer campo con error
        const firstErrorField = Object.keys(formErrors)[0];
        if (firstErrorField) {
          const element = document.getElementById(firstErrorField);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
          }
        }
      }
    } catch (error) {
      let errorMessage = 'Error en el registro';
      
      // Manejar errores específicos del servidor
      if (error.response) {
        if (error.response.status === 400) {
          if (error.response.data.message && error.response.data.message.includes('email')) {
            errorMessage = 'El correo electrónico ya está registrado';
            setFormErrors(prev => ({
              ...prev,
              email: 'Este correo electrónico ya está registrado'
            }));
          } else if (error.response.data.message && error.response.data.message.includes('username')) {
            errorMessage = 'El nombre de usuario ya está en uso';
            setFormErrors(prev => ({
              ...prev,
              username: 'Este nombre de usuario ya está en uso'
            }));
          } else {
            errorMessage = error.response.data.message || 'Datos de registro inválidos';
          }
        } else if (error.response.status === 409) {
          errorMessage = 'El usuario ya existe';
        }
      }
      
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }
      });
      
      // Desplazarse al primer campo con error
      const firstErrorField = Object.keys(formErrors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-900 via-gray-900 to-gray-900">
      {/* Left Side - Information */}
      <motion.div 
        className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-blue-800 to-blue-600 text-white"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="max-w-md mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Bienvenido a PrestamosApp</h1>
            <p className="text-blue-100">Únete a miles de usuarios que ya gestionan sus préstamos de manera eficiente.</p>
          </motion.div>

          <motion.ul className="space-y-4 mb-8">
            {[
              { icon: <RiSecurePaymentLine className="text-2xl" />, text: 'Gestión segura de pagos' },
              { icon: <FaCheckCircle className="text-2xl" />, text: 'Seguimiento en tiempo real' },
              { icon: <FaUsers className="text-2xl" />, text: 'Múltiples usuarios' },
              { icon: <FaRocket className="text-2xl" />, text: 'Interfaz intuitiva' }
            ].map((feature, index) => (
              <motion.li 
                key={index}
                custom={index}
                variants={featureVariants}
                className="flex items-center space-x-3"
              >
                <span className="text-blue-200">{feature.icon}</span>
                <span>{feature.text}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </motion.div>

      {/* Right Side - Registration Form */}
      <motion.div 
        className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 bg-white"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md">
          <motion.div 
            className="max-w-md mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8">
                <div className="text-center mb-8">
                  <motion.h2 
                    className="text-3xl font-extrabold text-gray-800"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Crear Cuenta
                  </motion.h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Regístrate para acceder a todas las funcionalidades
                  </p>
                </div>
                
                <form className="space-y-5" onSubmit={handleSubmit}>
                  {/* Nombre */}
                  <motion.div variants={itemVariants}>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        required
                        className={`appearance-none relative block w-full pl-10 px-3 py-3 border ${formErrors.nombre ? 'border-red-500' : 'border-gray-300'} bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                        placeholder="Tu nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                      />
                    </div>
                    <AnimatePresence>
                      {formErrors.nombre && (
                        <motion.p 
                          className="text-red-500 text-xs mt-1"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {formErrors.nombre}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Apellidos */}
                  <motion.div variants={itemVariants}>
                    <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 mb-1">
                      Apellidos
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="apellidos"
                        name="apellidos"
                        type="text"
                        required
                        className={`appearance-none relative block w-full pl-10 px-3 py-3 border ${formErrors.apellidos ? 'border-red-500' : 'border-gray-300'} bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                        placeholder="Tus apellidos"
                        value={formData.apellidos}
                        onChange={handleChange}
                      />
                    </div>
                    <AnimatePresence>
                      {formErrors.apellidos && (
                        <motion.p 
                          className="text-red-500 text-xs mt-1"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {formErrors.apellidos}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  
                  {/* Teléfono */}
                  <motion.div variants={itemVariants}>
                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        required
                        className={`appearance-none relative block w-full pl-10 px-3 py-3 border ${formErrors.telefono ? 'border-red-500' : 'border-gray-300'} bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                        placeholder="Número de teléfono"
                        value={formData.telefono}
                        onChange={handleChange}
                      />
                    </div>
                    <AnimatePresence>
                      {formErrors.telefono && (
                        <motion.p 
                          className="text-red-500 text-xs mt-1"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {formErrors.telefono}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Rol */}
                  <motion.div variants={itemVariants}>
                    <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-2">
                      Rol
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="rol"
                        name="rol"
                        required
                        value={formData.rol}
                        onChange={handleChange}
                        className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg"
                      >
                        <option value="ROLE_USER">Usuario</option>
                        <option value="ROLE_ADMIN">Administrador</option>
                      </select>
                    </div>
                    <AnimatePresence>
                      {formErrors.rol && (
                        <motion.p 
                          className="text-red-500 text-xs mt-1"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {formErrors.rol}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Email */}
                  <motion.div variants={itemVariants}>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Correo electrónico
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className={`appearance-none relative block w-full pl-10 px-3 py-3 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                        placeholder="tucorreo@ejemplo.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <AnimatePresence>
                      {formErrors.email && (
                        <motion.p 
                          className="text-red-500 text-xs mt-1"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {formErrors.email}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  
                  {/* Username */}
                  <motion.div variants={itemVariants}>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de usuario
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        className={`appearance-none relative block w-full pl-10 px-3 py-3 border ${formErrors.username ? 'border-red-500' : 'border-gray-300'} bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                        placeholder="Elige un nombre de usuario"
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </div>
                    <AnimatePresence>
                      {formErrors.username && (
                        <motion.p 
                          className="text-red-500 text-xs mt-1"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {formErrors.username}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  
                  {/* Password */}
                  <motion.div variants={itemVariants}>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className={`appearance-none relative block w-full pl-10 px-3 py-3 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                        placeholder="Crea una contraseña segura"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Mínimo 6 caracteres, incluye mayúsculas, minúsculas y números
                    </div>
                    <AnimatePresence>
                      {formErrors.password && (
                        <motion.p 
                          className="text-red-500 text-xs mt-1"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {formErrors.password}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  
                  {/* Confirm Password */}
                  <motion.div variants={itemVariants}>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar contraseña
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        className={`appearance-none relative block w-full pl-10 px-3 py-3 border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                        placeholder="Vuelve a escribir tu contraseña"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                    <AnimatePresence>
                      {formErrors.confirmPassword && (
                        <motion.p 
                          className="text-red-500 text-xs mt-1"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {formErrors.confirmPassword}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div 
                    className="mt-6"
                    variants={itemVariants}
                  >
                    <button
                      type="submit"
                      disabled={loading}
                      className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creando cuenta...
                        </>
                      ) : (
                        <>
                          <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            <FaCheckCircle className="h-5 w-5 text-blue-300 group-hover:text-blue-200" />
                          </span>
                          Crear cuenta
                        </>
                      )}
                    </button>
                  </motion.div>

                  <motion.div 
                    className="mt-6 text-center"
                    variants={itemVariants}
                  >
                    <p className="text-sm text-gray-600">
                      ¿Ya tienes una cuenta?{' '}
                      <Link 
                        to="/login" 
                        className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                      >
                        Inicia sesión
                      </Link>
                    </p>
                  </motion.div>
                </form>
              </div>
              
              <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
                <p className="text-xs text-gray-500 text-center">
                  Al registrarte, aceptas nuestros Términos de Servicio y Política de Privacidad.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;