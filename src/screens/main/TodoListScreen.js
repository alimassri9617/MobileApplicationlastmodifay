import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Card, FAB, Checkbox, IconButton } from 'react-native-paper';
import Modal from 'react-native-modal';
import { colors, spacing, typography } from '../../constants/theme';

import { useTodos } from '../../hooks/useTodos';

export default function TodoListScreen() {
  const { todos, loading, createTodo, updateTodo, deleteTodo } = useTodos();

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);

  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'Moderate', // backend expects "Top", "Moderate", "Low"
    date: '',
  });

  const [editTodo, setEditTodo] = useState(null);

  const toggleTodo = (todo) => {
    updateTodo(editTodo._id, {
  title,
  description,
  priority: priorityValue,
  date,
  completed,
});
};  

  const handleDeleteTodo = (todoId) => {
    deleteTodo(todoId);
  };

  const handleAddTodo = () => {
    if (!newTodo.title.trim() || !newTodo.date.trim()) {
      alert('Please provide both title and date.');
      return;
    }

    createTodo(newTodo);
    setNewTodo({ title: '', description: '', priority: 'Moderate', date: '' });
    setAddModalVisible(false);
  };

  // Open edit modal and set current todo data
  const openEditModal = (todo) => {
    setEditTodo({
      _id: todo._id,
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority || 'Moderate',
      date: todo.date || '',
      completed: todo.completed,
    });
    setEditModalVisible(true);
  };

  // Save updates
  const handleUpdateTodo = () => {
  if (!editTodo.title.trim() || !editTodo.date.trim()) {
    alert('Please provide both title and date.');
    return;
  }

  // Only send allowed fields to backend
  const { title, description, priority, date, completed } = editTodo;

  // Optional: log the request payload
  console.log('Updating Todo with:', {
    title,
    description,
    priority,
    date,
    completed,
  });

  // Call update from the custom hook
 const priorityValue = editTodo.priority || 'Moderate';

updateTodo(editTodo._id, {
  title,
  description,
  priority: priorityValue,
  date,
  completed,
});


  // Close modal and reset form
  setEditModalVisible(false);
  setEditTodo(null);
};


  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Top':
        return colors.error;
      case 'Moderate':
        return colors.warning;
      case 'Low':
        return colors.success;
      default:
        return colors.gray;
    }
  };

  const renderTodoItem = ({ item }) => (
    <Card style={[styles.todoCard, item.completed && styles.completedCard]}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.todoHeader}>
          <Checkbox
            status={item.completed ? 'checked' : 'unchecked'}
            onPress={() => toggleTodo(item)}
            color={colors.primary}
          />
          <View style={styles.todoInfo}>
            <Text
              style={[styles.todoTitle, item.completed && styles.completedText]}
            >
              {item.title}
            </Text>
            {item.description ? (
              <Text
                style={[
                  styles.todoDescription,
                  item.completed && styles.completedText,
                ]}
              >
                {item.description}
              </Text>
            ) : null}
          </View>
          <View style={styles.todoActions}>
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: getPriorityColor(item.priority) },
              ]}
            >
              <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
            </View>
            {/* EDIT button */}
            <IconButton
              icon="pencil"
              size={20}
              iconColor={colors.primary}
              onPress={() => openEditModal(item)}
            />
            {/* DELETE button */}
            <IconButton
              icon="delete"
              size={20}
              iconColor={colors.error}
              onPress={() => handleDeleteTodo(item._id)}
            />
          </View>
        </View>

        {item.date ? (
          <View style={styles.todoFooter}>
            <Text style={styles.dueDateText}>
              Due: {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>
        ) : null}
      </Card.Content>
    </Card>
  );

  const completedTodos = todos.filter((todo) => todo.completed);
  const pendingTodos = todos.filter((todo) => !todo.completed);

  return (
    <View style={styles.container}>
      {/* Stats Header */}
      <View style={styles.statsHeader}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{pendingTodos.length}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{completedTodos.length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{todos.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Todo List */}
      <FlatList
        data={todos}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item._id.toString()}
        style={styles.todoList}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={() => {}}
      />

      {/* Add Todo FAB */}
      <FAB style={styles.fab} icon="plus" onPress={() => setAddModalVisible(true)} />

      {/* Add Todo Modal */}
      <Modal
        isVisible={isAddModalVisible}
        onBackdropPress={() => setAddModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Todo</Text>

          <TextInput
            style={styles.input}
            placeholder="Todo title"
            value={newTodo.title}
            onChangeText={(text) => setNewTodo({ ...newTodo, title: text })}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description (optional)"
            value={newTodo.description}
            onChangeText={(text) => setNewTodo({ ...newTodo, description: text })}
            multiline
            numberOfLines={3}
          />

          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={newTodo.date}
            onChangeText={(text) => setNewTodo({ ...newTodo, date: text })}
          />

          <View style={styles.priorityContainer}>
            <Text style={styles.priorityLabel}>Priority:</Text>
            <View style={styles.priorityButtons}>
              {['Low', 'Moderate', 'Top'].map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityButton,
                    newTodo.priority === priority && styles.selectedPriority,
                    { borderColor: getPriorityColor(priority) },
                  ]}
                  onPress={() => setNewTodo({ ...newTodo, priority })}
                >
                  <Text
                    style={[
                      styles.priorityButtonText,
                      newTodo.priority === priority && { color: getPriorityColor(priority) },
                    ]}
                  >
                    {priority.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setAddModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
              <Text style={styles.addButtonText}>Add Todo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Todo Modal */}
      <Modal
        isVisible={isEditModalVisible}
        onBackdropPress={() => {
          setEditModalVisible(false);
          setEditTodo(null);
        }}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Todo</Text>

          <TextInput
            style={styles.input}
            placeholder="Todo title"
            value={editTodo?.title || ''}
            onChangeText={(text) => setEditTodo({ ...editTodo, title: text })}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description (optional)"
            value={editTodo?.description || ''}
            onChangeText={(text) => setEditTodo({ ...editTodo, description: text })}
            multiline
            numberOfLines={3}
          />

          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={editTodo?.date || ''}
            onChangeText={(text) => setEditTodo({ ...editTodo, date: text })}
          />

          <View style={styles.priorityContainer}>
            <Text style={styles.priorityLabel}>Priority:</Text>
            <View style={styles.priorityButtons}>
              {['Low', 'Moderate', 'Top'].map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityButton,
                    editTodo?.priority === priority && styles.selectedPriority,
                    { borderColor: getPriorityColor(priority) },
                  ]}
                  onPress={() => setEditTodo({ ...editTodo, priority })}
                >
                  <Text
                    style={[
                      styles.priorityButtonText,
                      editTodo?.priority === priority && { color: getPriorityColor(priority) },
                    ]}
                  >
                    {priority.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setEditModalVisible(false);
                setEditTodo(null);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleUpdateTodo}>
              <Text style={styles.addButtonText}>Update Todo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  statsHeader: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacing.lg,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...typography.h4,
    color: colors.primary,
    fontWeight: 'bold',
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  todoList: {
    flex: 1,
  },
  listContent: {
    padding: spacing.md,
  },
  todoCard: {
    marginBottom: spacing.md,
    elevation: 2,
  },
  completedCard: {
    opacity: 0.7,
  },
  cardContent: {
    padding: spacing.md,
  },
  todoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  todoInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  todoTitle: {
    ...typography.h6,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  todoDescription: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  todoActions: {
    alignItems: 'flex-end',
  },
  priorityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginBottom: spacing.xs,
  },
  priorityText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: 'bold',
  },
  todoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  dueDateText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    margin: spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
  modal: {
    justifyContent: 'center',
    margin: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 16,
  },
  modalTitle: {
    ...typography.h5,
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...typography.body1,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    marginBottom: spacing.lg,
  },
  priorityLabel: {
    ...typography.body1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  priorityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
  },
  selectedPriority: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  priorityButtonText: {
    ...typography.caption,
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    marginRight: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  cancelButtonText: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  addButton: {
    flex: 1,
    paddingVertical: spacing.md,
    marginLeft: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  addButtonText: {
    ...typography.body1,
    color: colors.white,
    fontWeight: 'bold',
  },
});
