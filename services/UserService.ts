import AuthorizationService from "./AuthService";

const UserService = {
  getUser: async (token: string) => {
    const verifiedToken = await AuthorizationService.decodeToken(token);

    return {
      isAuthenticated: Boolean(token),
      user: verifiedToken ? token.user : null,
    };
  },
};

export default UserService;
