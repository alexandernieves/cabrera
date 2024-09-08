// // import * as functions from "firebase-functions";
// // import * as admin from "firebase-admin";
// import * as jwt from "jsonwebtoken"; // JWT library

// // Inicializa Firebase Admin SDK
// admin.initializeApp();

// // Definir una interfaz para los datos del usuario que esperamos
// interface UserData {
//   email: string;
//   role: string;
// }

// // Función para generar el token JWT
// // export const generateToken = functions.https.onRequest(async (req, res) => {
//   // Extraemos el UID del cuerpo de la solicitud
// //   const {uid} = req.body;

// //   if (!uid) {
//     res.status(400).json({error: "No UID provided"});
//     return; // Finalizamos la ejecución
//   }

//   try {
//     // Obtener el documento del usuario desde Firestore basado en el UID
//     const userRef = admin.firestore().collection("users").doc(uid);
//     const userDoc = await userRef.get();

//     // Si el documento no existe, devolvemos un error
//     if (!userDoc.exists) {
//       res.status(404).json({error: "User not found"});
//       return; // Finalizamos la ejecución
//     }

//     // Obtenemos los datos del usuario
//     const userData = userDoc.data() as UserData; // Usamos la interfaz para forzar los tipos

//     // Generamos el JWT con los datos del usuario
//     const token = jwt.sign(
//       {
//         uid: uid,
//         email: userData.email,
//         role: userData.role,
//       },
//       "secretKey", // Llave secreta para firmar el JWT (¡cámbiala a algo seguro!)
//       {
//         expiresIn: "1h", // El token expirará en 1 hora
//       }
//     );

//     // Enviamos el token al cliente
//     res.json({token});
//     return; // Finalizamos la ejecución
//   } catch (error) {
//     console.error("Error al generar el token:", error);
//     res.status(500).json({error: "Internal Server Error"});
//     return; // Finalizamos la ejecución
//   }
// });
