import * as AuthService from "../services/auth_service.js";

export async function login(req, res) {
  try {
    const result = await AuthService.authenticateUser(req.body);
    res.status(200).json({
      message: `Bienvenue ${result.type}.`,
      token: result.token, 
      type: result.type, 
    });
 } catch (error) {
  res.status(401).send(`<h1>${error.message}</h1>`);
  }
}

