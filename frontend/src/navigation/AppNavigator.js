import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../context/AuthContext';

// Ecrãs de autenticação
import LoginScreen from '../screens/auth/LoginScreen';
import RegistoScreen from '../screens/auth/RegistoScreen';


// Ecrãs do administrador
import AdminDashboard from '../screens/admin/AdminDashboard';
import ListaMesasScreen from '../screens/admin/ListaMesasScreen';
import CriarMesaScreen from '../screens/admin/CriarMesaScreen';
import DetalhesMesaScreen from '../screens/admin/DetalhesMesaScreen';
import ChatScreen from '../screens/admin/ChatScreen';
import UtilizadoresScreen from '../screens/admin/UtilizadoresScreen';
import PendentesScreen from '../screens/admin/PendentesScreen';

// Ecrãs do docente
import DocenteDashboard from '../screens/docente/DocenteDashboard';
import FormacaoScreen from '../screens/docente/FormacaoScreen';
import PublicacoesScreen from '../screens/docente/PublicacoesScreen';
import LivrosScreen from '../screens/docente/LivrosScreen';
import PremiosScreen from '../screens/docente/PremiosScreen';
import ProjetosScreen from '../screens/docente/ProjetosScreen';

// Ecrãs do estudante
import EstudanteDashboard from '../screens/estudante/EstudanteDashboard';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { utilizador, carregando } = useAuth();

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F2952' }}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!utilizador ? (
          // Ecrãs públicos — sem login
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registo" component={RegistoScreen} />
           
          </>
        ) : utilizador.perfil === 'admin' ? (
          <>
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
            <Stack.Screen name="ListaMesas" component={ListaMesasScreen} />
            <Stack.Screen name="CriarMesa" component={CriarMesaScreen} />
            <Stack.Screen name="DetalhesMesa" component={DetalhesMesaScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Utilizadores" component={UtilizadoresScreen} />
             <Stack.Screen name="Pendentes" component={PendentesScreen} />
          </>
        ) : utilizador.perfil === 'docente' ? (
          <>
            <Stack.Screen name="DocenteDashboard" component={DocenteDashboard} />
            <Stack.Screen name="Formacao" component={FormacaoScreen} />
            <Stack.Screen name="Publicacoes" component={PublicacoesScreen} />
            <Stack.Screen name="Livros" component={LivrosScreen} />
            <Stack.Screen name="Premios" component={PremiosScreen} />
            <Stack.Screen name="Projetos" component={ProjetosScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
          </>
        ) : utilizador.perfil === 'estudante' ? (
          <>
            <Stack.Screen name="EstudanteDashboard" component={EstudanteDashboard} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}