import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";

import useSignUp from "../hooks/useSignUp.js";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { isPending, error, signupMutation } = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* FORMULARIO DE REGISTRO - LADO IZQUIERDO */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* LOGO */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              HablaYa
            </span>
          </div>

          {/* MENSAJE DE ERROR */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Crea una cuenta</h2>
                  <p className="text-sm opacity-70">
                    Únete a HablaYa y comienza tu aventura en el aprendizaje de
                    idiomas.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* NOMBRE COMPLETO */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Nombre completo</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Juan Pérez"
                      className="input input-bordered w-full"
                      value={signupData.fullName}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          fullName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  {/* CORREO */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Correo electrónico</span>
                    </label>
                    <input
                      type="email"
                      placeholder="juan@gmail.com"
                      className="input input-bordered w-full"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({ ...signupData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  {/* CONTRASEÑA */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Contraseña</span>
                    </label>
                    <input
                      type="password"
                      placeholder="********"
                      className="input input-bordered w-full"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <p className="text-xs opacity-70 mt-1">
                      La contraseña debe tener al menos 6 caracteres
                    </p>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        required
                      />
                      <span className="text-xs leading-tight">
                        Acepto los{" "}
                        <span className="text-primary hover:underline">
                          términos de servicio
                        </span>{" "}
                        y la{" "}
                        <span className="text-primary hover:underline">
                          política de privacidad
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                <button className="btn btn-primary w-full" type="submit">
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Cargando...
                    </>
                  ) : (
                    "Crear cuenta"
                  )}
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Inicia sesión
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* LADO DERECHO - ILUSTRACIÓN */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Ilustración */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/i.png"
                alt="Ilustración de conexión de idiomas"
                className="w-full h-full"
              />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Conéctate con compañeros de idiomas en todo el mundo
              </h2>
              <p className="opacity-70">
                Practica conversaciones, haz amigos y mejora tus habilidades
                lingüísticas junto a otros.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
