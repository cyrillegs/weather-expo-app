import * as React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // ✅ fixed import
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  // 🔹 Handle Sign Up submission
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    if (!emailAddress || !password) {
      Alert.alert("Error", "Please enter your email and password");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      // Create user
      await signUp.create({
        emailAddress,
        password,
      });

      // Send verification email
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("Sign Up Failed", "Please check your email and try again");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Handle Email Verification
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    if (!code) {
      Alert.alert("Error", "Please enter the verification code");
      return;
    }

    setIsLoading(true);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
        Alert.alert("Verification Failed", "Please check your code and try again");
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("Verification Failed", "Please check your code and try again");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Verification Screen
  if (pendingVerification) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 justify-center px-6">
            {/* Header */}
            <View className="mb-8">
              <Text className="text-3xl font-bold text-gray-800 text-center mb-2">
                Verify Your Email
              </Text>
              <Text className="text-gray-600 text-center text-base">
                We've sent a verification code to your email
              </Text>
            </View>

            {/* Verification Form Card */}
            <View className="bg-white rounded-2xl shadow-lg shadow-gray-200 p-6 mb-6">
              <View className="mb-6">
                <Text className="text-gray-700 font-medium mb-2 text-sm">
                  Verification Code
                </Text>
                <TextInput
                  value={code}
                  placeholder="Enter your verification code"
                  onChangeText={setCode}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:bg-white text-center text-lg font-semibold"
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>

              <TouchableOpacity
                onPress={onVerifyPress}
                disabled={isLoading}
                className="rounded-xl py-4 px-6 bg-blue-500"
              >
                <Text className="text-white font-semibold text-center text-base">
                  {isLoading ? "Verifying..." : "Verify Email"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Try Again Link */}
            <View className="flex-row justify-center items-center">
              <Text className="text-gray-600 text-base">Didn't receive the code?</Text>
              <TouchableOpacity
                className="ml-2"
                onPress={() => setPendingVerification(false)}
              >
                <Text className="text-blue-600 font-semibold text-base">
                  Try Again
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // 🔹 Sign Up Form
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-800 text-center mb-2">
              Create Account
            </Text>
            <Text className="text-gray-600 text-center text-base">
              Sign up to get started with your account
            </Text>
          </View>

          {/* Form Card */}
          <View className="bg-white rounded-2xl shadow-lg shadow-gray-200 p-6 mb-6">
            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2 text-sm">
                Email Address
              </Text>
              <TextInput
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Enter your email"
                onChangeText={setEmailAddress}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:bg-white"
                keyboardType="email-address"
              />
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-2 text-sm">
                Password
              </Text>
              <TextInput
                value={password}
                placeholder="Create a password (min. 8 characters)"
                secureTextEntry
                onChangeText={setPassword}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:bg-white"
              />
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={onSignUpPress}
              disabled={isLoading}
              className="rounded-xl py-4 px-6 bg-blue-500"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-center text-base">
                {isLoading ? "Creating Account..." : "Create Account"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Link */}
          <View className="flex-row justify-center items-center">
            <Text className="text-gray-600 text-base">
              Already have an account?
            </Text>
            <Link href="/sign-in" asChild>
              <TouchableOpacity className="ml-2">
                <Text className="text-blue-600 font-semibold text-base">
                  Sign In
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
