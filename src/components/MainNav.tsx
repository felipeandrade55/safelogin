import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

export function MainNav() {
  return (
    <div className="flex justify-between items-center mb-6">
      <div></div>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Cadastros</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-4 w-[200px]">
                <Link
                  to="/company-registration"
                  className="block p-2 hover:bg-accent rounded-md"
                >
                  Cadastro de Empresa
                </Link>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}