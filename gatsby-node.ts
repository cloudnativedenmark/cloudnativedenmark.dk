export const createSchemaCustomization = ({ actions }: { actions: any }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type SiteSiteMetadataTeam {
      name: String
      position: String
      linkedin: String
      image: File @link(by:"relativePath")
    }
  `;
  createTypes(typeDefs);
};
