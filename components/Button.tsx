import { Pressable, PressableProps } from "react-native";

export default function Button({ children, ...rest }: PressableProps) {
  return <Pressable {...rest}>{children}</Pressable>;
}
