import ProtectedRoute from "@/components/ProtectedRoute";

const withAdmin = (Component: React.FC) => (props: any) =>
  (
    <ProtectedRoute requireAdmin={true}>
      <Component {...props} />
    </ProtectedRoute>
  );

export default withAdmin;
