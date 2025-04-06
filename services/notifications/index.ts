import axios from "axios";
import API_ROUTES from "../routes.config";
import { DivideCircleIcon } from "lucide-react-native";

export async function SEND_EXPO_TOKEN_TO_BACKEND(
  expoToken: string,
  authToken: string
) {
  try {
    // console.log("Expo Token:", expoToken);

    const reponse = await axios.post(
      API_ROUTES.NOTIFICATIONS.REGISTER_EXPO_TOKEN,
      { ExpoToken: expoToken },
      {
        headers: {
          authToken,
        },
      }
    );
    console.log(reponse.data);
  } catch (error: any) {
    console.log(
      "Error while registering device using expo token (Internal Server Error)",
      error.message
    );
  }
}

export async function SEND_TEST_NOTIFICATION(
  notification_payload: any,
  authToken: string | null,
  expoToken: string | null
) {
  if(!authToken || !expoToken) return;
  try {
    console.log(notification_payload);
    
    if (authToken === null) {
      console.log("Auth token not found and is required");

      return;
    }
    const response = await axios.post(
      API_ROUTES.NOTIFICATIONS.TEST_NOTIFICATION,
      {
        title: notification_payload.title,
        body: notification_payload.body,
        data: {
          message: notification_payload.data.message,
          type: notification_payload.data.type,
          additionalInfo: notification_payload.data.additionalInfo,
        },
        ExpoToken: expoToken
      },
      {
        headers: { authToken },
      }
    );
    console.log(response.data);
  } catch (error: any) {
    console.log("Error while sending test notification - ", error.message);
  }
}







