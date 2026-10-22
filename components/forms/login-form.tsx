"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { LoginFormValues, loginSchema } from "@/core/lib/validations/schema";
import { useAuth } from "@/core/hooks/use-auth";

export default function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: LoginFormValues): Promise<void> {
    setAuthError(null);

    try {
      const result = await signIn(values.email, values.password);

      if (result.success) {
        toast.success("Connexion réussie 🎉");
        router.push("/dashboard/prospects");
      } else {
        if (result.error === "AuthApiError: Invalid login credentials") {
          toast.error("Adresse email ou mot de passe incorrect 🚫");
        } else if (result.error === "AuthApiError: Email not confirmed") {
          toast.error("Vous n'avez pas encore confirmé votre email", {
            description:
              "Veuillez vous rendre dans votre messagerie pour vérifier votre adresse",
          });
        } else {
          setAuthError(result.error || "Échec de la connexion.");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Erreur inattendue lors de la connexion ❌ " + error.message);
      } else {
        toast.error("Erreur inattendue lors de la connexion ❌");
      }
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {authError ? (
        <Alert variant="destructive" className="border-red-500/30 bg-red-500/10 text-red-400">
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      ) : null}

      <FieldGroup className="space-y-5">
        {/* CHAMP EMAIL */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="space-y-2">
              <FieldLabel htmlFor={field.name} className="text-sm font-medium text-slate-200">
                Adresse email
              </FieldLabel>

              <Input
                {...field}
                id={field.name}
                type="email"
                placeholder="exemple@dimensions.com"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
                className="w-full rounded-lg border border-slate-800 bg-[#0d1527] px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />

              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} className="text-xs text-red-400" />
              ) : null}
            </Field>
          )}
        />

        {/* CHAMP MOT DE PASSE */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="space-y-2">
              <FieldLabel htmlFor={field.name} className="text-sm font-medium text-slate-200">
                Mot de passe
              </FieldLabel>

              <div className="relative">
                <Input
                  {...field}
                  id={field.name}
                  type={showPassword ? "text" : "password"}
                  placeholder="Votre mot de passe"
                  autoComplete="current-password"
                  aria-invalid={fieldState.invalid}
                  className="w-full rounded-lg border border-slate-800 bg-[#0d1527] px-4 py-3 pr-11 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label={
                    showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>

              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} className="text-xs text-red-400" />
              ) : null}
            </Field>
          )}
        />

        {/* CASE SE SOUVENIR DE MOI */}
        <Controller
          name="rememberMe"
          control={form.control}
          render={({ field }) => (
            <Field orientation="horizontal" className="flex items-center space-x-3 pt-1">
              <Checkbox
                id="rememberMe"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                className="h-4 w-4 rounded border-slate-700 bg-[#0d1527] data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
              />

              <FieldContent>
                <FieldLabel
                  htmlFor="rememberMe"
                  className="cursor-pointer text-sm font-normal text-slate-300"
                >
                  Se souvenir de moi
                </FieldLabel>
              </FieldContent>
            </Field>
          )}
        />
      </FieldGroup>

      {/* BOUTON SE CONNECTER */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-emerald-500 py-3.5 text-base font-semibold text-slate-950 transition-all hover:bg-emerald-400 focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 size-5 animate-spin" />
            Connexion...
          </>
        ) : (
          "Se connecter"
        )}
      </Button>
    </form>
  );
}