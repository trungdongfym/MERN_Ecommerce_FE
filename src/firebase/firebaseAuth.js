import { getAdditionalUserInfo, GoogleAuthProvider,FacebookAuthProvider ,signInWithPopup } from "firebase/auth";
import { methodLoginEnum } from "../helpers/constants/userConst";
import { loginWithThirdPartySchema } from "../validates/userSchema";
import { firebaseAuth } from "./firebase";

function createDataLoginFirebase(credentialUser, userInfo, methodLogin) {
   const {
      user: { uid, displayName, email, phoneNumber, photoURL, stsTokenManager: { accessToken, refreshToken } }
   } = credentialUser;
   const { isNewUser } = userInfo;
   const userPayload = {
      user: {
         uid: uid,
         name: displayName,
         email: email,
         phone: phoneNumber || '',
         avatar: photoURL,
      },
      token: {
         accessToken,
         refreshToken
      },
      isNewUser,
      rememberMe: false,
      methodLogin: methodLogin
   }
   return userPayload;
}

const loginWithThirdParty = async (type) => {

   let provider = null;
   if (type === methodLoginEnum.google) provider = new GoogleAuthProvider();
   if (type === methodLoginEnum.facebook) provider = new FacebookAuthProvider();
   try {
      const credentialUser = await signInWithPopup(firebaseAuth, provider);
      const userInfo = getAdditionalUserInfo(credentialUser);
      const userPayload = createDataLoginFirebase(credentialUser, userInfo, methodLoginEnum.google);
      // Validate before sent
      await loginWithThirdPartySchema.validate(userPayload);
      return userPayload;
   } catch (error) {
      throw error;
   }
}

export {
   loginWithThirdParty
}