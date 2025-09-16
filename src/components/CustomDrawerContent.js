import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/AuthStore';
import { useLogout } from '../hooks/useLogout';
import { colors, spacing, typography } from '../constants/theme';

export default function CustomDrawerContent(props) {
  const { authUser } = useAuthStore();
  const { logout, loading } = useLogout();
const handleLogout = ()=>{

};
  
  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollView}>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: authUser?.profilePic || 'https://via.placeholder.com/80',
            }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>
            {authUser?.firstName} {authUser?.lastName}
          </Text>
          <Text style={styles.userEmail}>{authUser?.email}</Text>
          {authUser?.role && (
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{authUser.role.toUpperCase()}</Text>
            </View>
          )}
        </View>

        {/* Navigation Items */}
        <View style={styles.navigationSection}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      {/* Logout Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={loading}
        >
          <Ionicons name="log-out-outline" size={24} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flexGrow: 1,
  },
  profileSection: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.lightGray,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: spacing.md,
  },
  userName: {
    ...typography.h5,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  roleBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  roleText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: 'bold',
  },
  navigationSection: {
    flex: 1,
    paddingTop: spacing.md,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  logoutText: {
    ...typography.body1,
    color: colors.error,
    marginLeft: spacing.md,
    fontWeight: '500',
  },
});

