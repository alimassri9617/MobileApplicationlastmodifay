import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Linking,
} from 'react-native';
import { Avatar, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useGetStaff } from '../../hooks/useGetStaff';
import { colors, spacing, typography } from '../../constants/theme';

export default function StaffListScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const { loading, staff } = useGetStaff();

  const filteredStaff = (staff || []).filter((member) => {
    const first = member?.firstName || '';
    const last = member?.lastName || '';

    const matchesSearch =
      first.toLowerCase().includes(searchTerm.toLowerCase()) ||
      last.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleCall = (phoneNumber) => {
    if (phoneNumber) Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (email) => {
    if (email) Linking.openURL(`mailto:${email}`);
  };

  const renderStaffItem = ({ item }) => (
    <Card style={styles.staffCard}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.staffHeader}>


  {/* {console.log(item.profilePic)} */}
  
  {item.profilePic &&
    (item.profilePic.substring(0, 33) === 'https://ui-avatars.com/api/?name=' ? (
      <Avatar.Text
        size={64}
        label={`${item.firstName.charAt(0)}${item.lastName.charAt(0)}`}
        style={{ backgroundColor: colors.primary }}
      />
    ) : (
      <Avatar.Image
        size={64}
        source={{ uri: item.profilePic }}
      />
    ))
  }
          {/* <Avatar.Image
            size={64}
            source={{ uri: item.profilePic  }}
          /> */}
          <View style={styles.staffInfo}>
            <Text style={styles.staffName}>
              {item.firstName} {item.lastName}
            </Text>
            <Text style={styles.staffTitle}>{item.title}</Text>
          </View>
        </View>

        <View style={styles.contactInfo}>
          {item.email && (
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.contactText}>{item.email}</Text>
            </View>
          )}
          {item.phone && (
            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.contactText}>{item.phone}</Text>
            </View>
          )}
          {item.office && (
            <View style={styles.contactItem}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.contactText}>{item.office}</Text>
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          {item.email && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEmail(item.email)}
            >
              <Ionicons name="mail" size={20} color={colors.primary} />
              <Text style={styles.actionButtonText}>Email</Text>
            </TouchableOpacity>
          )}
          {item.phone && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleCall(item.phone)}
            >
              <Ionicons name="call" size={20} color={colors.primary} />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search staff members..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {/* Staff List */}
      <FlatList
        data={filteredStaff}
        renderItem={renderStaffItem}
        keyExtractor={(item) => item._id}
        style={styles.staffList}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    margin: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 25,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    ...typography.body1,
  },
  filterContainer: {
    marginBottom: spacing.md,
  },
  chipContainer: {
    paddingHorizontal: spacing.md,
  },
  departmentChip: {
    marginRight: spacing.sm,
    backgroundColor: colors.lightGray,
  },
  selectedChip: {
    backgroundColor: colors.primary,
  },
  chipText: {
    color: colors.text,
  },
  selectedChipText: {
    color: colors.white,
  },
  staffList: {
    flex: 1,
  },
  listContent: {
    padding: spacing.md,
  },
  staffCard: {
    marginBottom: spacing.md,
    elevation: 2,
  },
  cardContent: {
    padding: spacing.md,
  },
  staffHeader: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  staffInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  staffName: {
    ...typography.h6,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  staffTitle: {
    ...typography.body1,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  staffDepartment: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  contactInfo: {
    marginBottom: spacing.md,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  contactText: {
    ...typography.body2,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  actionButtonText: {
    ...typography.body2,
    color: colors.primary,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
});

