import { Box, Flex, Link, Stack, Text, Heading, Button, Separator } from "@chakra-ui/react";
import { Link as RouterLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { FaSignOutAlt } from "react-icons/fa";

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Flex minH="100vh">
      <Box
        w="250px"
        p="5"
        display="flex"
        flexDirection="column"
      >
        <Heading size="md" mb="10" color="purple.500">
          Admin Panel
        </Heading>

        <Stack gap="4" align="stretch" flex="1">
          <Link asChild _hover={{ textDecor: 'none', color: 'purple.750' }}>
            <RouterLink to="/">
              <Text fontWeight="bold">Dashboard</Text>
            </RouterLink>
          </Link>

          <Link asChild _hover={{ textDecor: 'none', color: 'purple.750' }}>
            <RouterLink to="/users">
              <Text fontWeight="bold">Usuários</Text>
            </RouterLink>
          </Link>
        </Stack>

        <Separator my="4" />

        {user && (
          <Box mb="4">
            <Text fontSize="sm" color="gray.400">Logado como:</Text>
            <Text fontWeight="medium" color="white" truncate>{user.name}</Text>
          </Box>
        )}

        <Button
          colorPalette="red"
          variant="outline"
          onClick={handleLogout}
          size="sm"
        >
          <FaSignOutAlt /> Sair
        </Button>
      </Box>

      <Box flex="1" p="8">
        <Outlet />
      </Box>
    </Flex>
  );
}