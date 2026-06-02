import { Stack } from "expo-router";
import Head from "expo-router/head";

const DEFAULT_TITLE = "My App";
const TITLE_TEMPLATE = `%s | ${DEFAULT_TITLE}`;

type ScreenProps = React.ComponentProps<typeof Stack.Screen> & {
  webTitle?: string;
};

export function Screen({ options, webTitle, ...props }: ScreenProps) {
  const screenTitle =
    typeof options !== "function" ? options?.title : undefined;
  const titlePart = webTitle === "" ? undefined : webTitle || screenTitle;
  const title = titlePart
    ? TITLE_TEMPLATE.replace("%s", titlePart)
    : DEFAULT_TITLE;

  return (
    <>
      <Stack.Screen options={options} {...props} />
      <Head>
        <title>{title}</title>
      </Head>
    </>
  );
}
