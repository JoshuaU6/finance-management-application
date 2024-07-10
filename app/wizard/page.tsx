import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Page = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }
  return (
    <div className="container flex flex-col max-w-2xl items-center justify-between gap-4">
      <div>
        <h1 className="text-center text-3xl">
          Welcome, <span className="ml-2 font-bold">{user.firstName}! 👋🏻</span>
        </h1>
        <h2 className="text-center mt-4 text-base text-muted-foreground">
          Let &apos;s get started by setting up your currency
        </h2>
        <h3 className="mt-2 text-center text-sm text-muted-foreground">
          You can change these settings at any time
        </h3>
      </div>
      <Separator />
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Currency</CardTitle>
          <CardDescription>
            Set your default currency for transactions
          </CardDescription>
        </CardHeader>

        <CardContent>
          <CurrencyComboBox />
        </CardContent>
      </Card>

      <Separator />
      <Button className="w-full" asChild>
        <Link href={"/"}>I&apos;m done! Take me to the dashboard</Link>
      </Button>

      <div className="mt-8">
        <Logo loading={false} mobile={false} />
      </div>
    </div>
  );
};

export default Page;
