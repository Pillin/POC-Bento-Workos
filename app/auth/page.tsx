import AuthService from "@/services/AuthService";
import UserContextProvider from "@/contexts/UserContext";
import NavBar from "@/components/Navbar";

export default async function Basic({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const authKitURL = await AuthService.getURL();

  return (
    <main className="flex column max-w-screen-xl w-screen gap-4">
      <UserContextProvider token={searchParams.token}>
        <NavBar authLink={authKitURL} />
      </UserContextProvider>
    </main>
  );
}
