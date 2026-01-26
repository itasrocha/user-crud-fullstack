import { Box, Flex, Link, Stack, Text, Heading } from "@chakra-ui/react";
import { Link as RouterLink, Outlet } from "react-router-dom";

export function Sidebar() {
  return (
    <Flex minH="100vh">
      <Box 
        w="250px" 
        bg="gray.100" 
        p="5" 
        borderRight="1px solid" 
        borderColor="gray.200"
      >
        <Heading size="md" mb="10" color="purple.500">
          Admin Panel
        </Heading>

        <Stack gap="4" align="stretch">
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
      </Box>

      <Box flex="1" p="8" bg="white">
        <Outlet />
      </Box>
    </Flex>
  );
}