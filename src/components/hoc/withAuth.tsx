import ProtectedRoute from "@/components/ProtectedRoute";

const withAuth = (Component: React.FC) => (props: any) =>
  (
    <ProtectedRoute>
      <Component {...props} />
    </ProtectedRoute>
  );

export default withAuth;
