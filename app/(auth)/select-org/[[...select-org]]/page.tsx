import { OrganizationList } from "@clerk/nextjs";

const CreateOrganizationPage = () => {
  return (
    <div style={styles.container}>
      <OrganizationList
        hidePersonal
        afterCreateOrganizationUrl="/project/roadmap"
        afterSelectOrganizationUrl="/project/roadmap"
      />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
};

export default CreateOrganizationPage;
