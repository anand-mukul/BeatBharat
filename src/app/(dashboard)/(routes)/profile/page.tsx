import { Metadata } from "next";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/forms/profile-form";
import { AccountForm } from "@/components/forms/account-form";
import { AppearanceForm } from "@/components/forms/appearance-form";
import { NotificationsForm } from "@/components/forms/notifications-form";
import { DisplayForm } from "@/components/forms/display-form";

export const metadata: Metadata = {
  title: "BeatBharat - Settings",
  description: "Manage your BeatBharat account settings.",
};

const settingsTabs = [
  { value: "profile", label: "Profile", component: ProfileForm },
  { value: "account", label: "Account", component: AccountForm },
  { value: "appearance", label: "Appearance", component: AppearanceForm },
  {
    value: "notifications",
    label: "Notifications",
    component: NotificationsForm,
  },
  { value: "display", label: "Display", component: DisplayForm },
];

const SettingsPage = () => {
  return (
    <div className="h-full px-4 py-6 lg:px-8">
      <Tabs defaultValue="profile" className="h-full space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            {settingsTabs.map(({ value, label }) => (
              <TabsTrigger key={value} value={value}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
        {settingsTabs.map(({ value, label, component: FormComponent }) => (
          <TabsContent
            key={value}
            value={value}
            className="border-none p-0 outline-none"
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">{label}</h3>
                <p className="text-sm text-muted-foreground">
                  {getTabDescription(value)}
                </p>
              </div>
              <Separator />
              <FormComponent />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

const getTabDescription = (tab: string): string => {
  switch (tab) {
    case "profile":
      return "This is how others will see you on the site.";
    case "account":
      return "Update your account settings. Set your preferred language and timezone.";
    case "appearance":
      return "Customize the appearance of the app. Automatically switch between day and night themes.";
    case "notifications":
      return "Configure how you receive notifications.";
    case "display":
      return "Turn items on or off to control what's displayed in the app.";
    default:
      return "";
  }
};

export default SettingsPage;
