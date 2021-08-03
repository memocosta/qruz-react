import gql from "graphql-tag";

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    name: String
    dashboardPerm: Boolean
    rolesPerm: Boolean
    archivePerm: Boolean
    communicationPerm: Boolean
    promocodesPerm: Boolean
    businessPerm: Boolean
    commutePerm: Boolean
    ondemandPerm: Boolean
    fleetPerm: Boolean
    paymentPerm: Boolean
    cancellationPerm: Boolean
    partnerID: Int
  }
`;

export const resolvers = {};