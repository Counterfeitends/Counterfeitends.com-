import HomeStorefront from "../HomeStorefront";

export const metadata = {
  title: "SMS / Counterfeitends",
  description: "Get Counterfeitends drop alerts and event invites by text.",
};

export default function SmsPage() {
  return <HomeStorefront showSmsModal />;
}