import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      {/* Login Form */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-8 lg:p-12 xl:p-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Bienvenido</h1>
            <p className="text-gray-600">Inicia sesión para acceder a tu cuenta</p>
          </div>

          <motion.div
            className="w-full p-8 space-y-6 bg-white rounded-2xl shadow-xl border border-gray-100"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="text-center" variants={itemVariants}>
              <motion.h2
                className="text-2xl font-bold text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Iniciar Sesión
              </motion.h2>
              <motion.p
                className="text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Usa tus credenciales para acceder al sistema
              </motion.p>
            </motion.div>

            <motion.form
              className="mt-8 space-y-6"
              onSubmit={handleSubmit}
              variants={itemVariants}
            >
              <motion.div className="rounded-md shadow-sm space-y-4" variants={itemVariants}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <label htmlFor="username" className="sr-only">Usuario</label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <label htmlFor="password" className="sr-only">Contraseña</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </motion.div>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="p-3 mb-4 rounded-md bg-red-50 border border-red-200"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div className="flex items-center justify-between" variants={itemVariants}>
                <motion.div
                  className="text-sm"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Link
                    to="/register"
                    className="text-blue-500 hover:text-blue-400 transition-colors duration-200"
                  >
                    ¿No tienes cuenta? Regístrate
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-6">
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </motion.button>
              </motion.div>
            </motion.form>
          </motion.div>
        </div>
      </div>

      {/* Sección visual */}
      <div className="hidden lg:flex lg:w-1/2 min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white text-center max-w-lg mx-auto">
            <h2 className="text-4xl font-bold mb-4">Sistema de Gestión de Préstamos</h2>
            <p className="text-blue-100 text-lg mb-8">
              Controla y gestiona todos tus préstamos de manera eficiente y segura en un solo lugar.
            </p>
            <div className="w-24 h-1 bg-blue-400 mx-auto mb-8"></div>
            <p className="text-blue-100">
              Accede a informes detallados, seguimiento de pagos y más.
            </p>
          </div>
        </div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.1))]"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
