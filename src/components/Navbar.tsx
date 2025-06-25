
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { BookOpen, User, LayoutDashboard, LogIn, UserPlus, ShoppingBag, Upload, Plus, Settings, Info, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">AssignEase</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                {user ? (
                  <>
                    {/* Main Actions */}
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="h-9">
                        <LayoutDashboard className="h-4 w-4 mr-1" />
                        Dashboard
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid w-[300px] gap-3 p-4">
                          <NavigationMenuLink asChild>
                            <Link
                              to="/dashboard"
                              className={cn(
                                "flex items-center space-x-2 rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                isActive('/dashboard') && "bg-accent"
                              )}
                            >
                              <LayoutDashboard className="h-4 w-4" />
                              <div>
                                <div className="font-medium">Dashboard</div>
                                <p className="text-sm text-muted-foreground">View your overview and stats</p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/order"
                              className={cn(
                                "flex items-center space-x-2 rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                isActive('/order') && "bg-accent"
                              )}
                            >
                              <Plus className="h-4 w-4" />
                              <div>
                                <div className="font-medium">Create Order</div>
                                <p className="text-sm text-muted-foreground">Place a new assignment order</p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Notes Section */}
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="h-9">
                        <ShoppingBag className="h-4 w-4 mr-1" />
                        Notes
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid w-[300px] gap-3 p-4">
                          <NavigationMenuLink asChild>
                            <Link
                              to="/notes"
                              className={cn(
                                "flex items-center space-x-2 rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                isActive('/notes') && "bg-accent"
                              )}
                            >
                              <ShoppingBag className="h-4 w-4" />
                              <div>
                                <div className="font-medium">Browse Notes</div>
                                <p className="text-sm text-muted-foreground">Find and purchase study notes</p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/sell-notes"
                              className={cn(
                                "flex items-center space-x-2 rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                isActive('/sell-notes') && "bg-accent"
                              )}
                            >
                              <Upload className="h-4 w-4" />
                              <div>
                                <div className="font-medium">Sell Notes</div>
                                <p className="text-sm text-muted-foreground">Upload and sell your notes</p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/my-notes"
                              className={cn(
                                "flex items-center space-x-2 rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                isActive('/my-notes') && "bg-accent"
                              )}
                            >
                              <BookOpen className="h-4 w-4" />
                              <div>
                                <div className="font-medium">My Notes</div>
                                <p className="text-sm text-muted-foreground">Manage your purchased notes</p>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Info Pages */}
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="h-9">
                        <Info className="h-4 w-4 mr-1" />
                        Info
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid w-[250px] gap-3 p-4">
                          <NavigationMenuLink asChild>
                            <Link
                              to="/services"
                              className={cn(
                                "flex items-center space-x-2 rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                isActive('/services') && "bg-accent"
                              )}
                            >
                              <Settings className="h-4 w-4" />
                              <div className="font-medium">Services</div>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/about"
                              className={cn(
                                "flex items-center space-x-2 rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                isActive('/about') && "bg-accent"
                              )}
                            >
                              <Info className="h-4 w-4" />
                              <div className="font-medium">About</div>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/contact"
                              className={cn(
                                "flex items-center space-x-2 rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                isActive('/contact') && "bg-accent"
                              )}
                            >
                              <Phone className="h-4 w-4" />
                              <div className="font-medium">Contact</div>
                            </Link>
                          </NavigationMenuLink>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </>
                ) : (
                  <>
                    {/* Public Navigation */}
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/notes"
                          className={cn(
                            "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                            isActive('/notes') && "bg-accent"
                          )}
                        >
                          <ShoppingBag className="h-4 w-4 mr-1" />
                          Notes
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="h-9">
                        <Info className="h-4 w-4 mr-1" />
                        Info
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid w-[200px] gap-3 p-4">
                          <NavigationMenuLink asChild>
                            <Link
                              to="/services"
                              className={cn(
                                "flex items-center space-x-2 rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                isActive('/services') && "bg-accent"
                              )}
                            >
                              <Settings className="h-4 w-4" />
                              <div className="font-medium">Services</div>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/about"
                              className={cn(
                                "flex items-center space-x-2 rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                isActive('/about') && "bg-accent"
                              )}
                            >
                              <Info className="h-4 w-4" />
                              <div className="font-medium">About</div>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/contact"
                              className={cn(
                                "flex items-center space-x-2 rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                isActive('/contact') && "bg-accent"
                              )}
                            >
                              <Phone className="h-4 w-4" />
                              <div className="font-medium">Contact</div>
                            </Link>
                          </NavigationMenuLink>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </>
                )}
              </NavigationMenuList>
            </NavigationMenu>

            {/* User Actions */}
            <div className="flex items-center space-x-2 border-l pl-4">
              {user ? (
                <>
                  <Link to="/admin">
                    <Button 
                      variant={isActive('/admin') ? 'default' : 'ghost'}
                      size="sm"
                    >
                      Admin
                    </Button>
                  </Link>
                  
                  <Link to="/profile">
                    <Button 
                      variant={isActive('/profile') ? 'default' : 'ghost'}
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Button>
                  </Link>
                  
                  <Button onClick={handleSignOut} variant="outline" size="sm">
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button 
                      variant={isActive('/login') ? 'default' : 'ghost'}
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Login</span>
                    </Button>
                  </Link>
                  
                  <Link to="/signup">
                    <Button 
                      variant={isActive('/signup') ? 'default' : 'outline'}
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Sign Up</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
