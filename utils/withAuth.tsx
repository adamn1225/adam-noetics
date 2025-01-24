import { supabase } from "@lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthenticatedComponent = (props: any) => {
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        const { data } = await supabase.auth.getSession();

        if (!data.session) {
          // Redirect to login if not authenticated
          router.push("/login");
        }
      };

      checkAuth();
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;