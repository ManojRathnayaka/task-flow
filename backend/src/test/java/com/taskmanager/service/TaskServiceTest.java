package com.taskmanager.service;

import com.taskmanager.dto.request.TaskRequest;
import com.taskmanager.dto.response.TaskResponse;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.mapper.TaskMapper;
import com.taskmanager.model.Task;
import com.taskmanager.model.User;
import com.taskmanager.model.enums.TaskPriority;
import com.taskmanager.model.enums.TaskStatus;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.service.impl.TaskServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * TaskServiceTest — unit tests for TaskServiceImpl.
 *
 * <p>Uses Mockito to mock all dependencies (repositories, mapper),
 * so tests run without a database or Spring context.
 *
 * <p><b>L Principle</b> is verified here: TaskServiceImpl is tested through
 * the TaskService interface, confirming the implementation is a valid substitute.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("TaskService Unit Tests")
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TaskMapper taskMapper;

    @InjectMocks
    private TaskServiceImpl taskService; // Implementation injected, but TaskService interface used for testing

    private User testUser;
    private Task testTask;
    private TaskResponse testTaskResponse;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .password("encoded_password")
                .build();

        testTask = Task.builder()
                .id(1L)
                .title("Test Task")
                .description("Test Description")
                .status(TaskStatus.TODO)
                .priority(TaskPriority.MEDIUM)
                .user(testUser)
                .createdAt(LocalDateTime.now())
                .build();

        testTaskResponse = TaskResponse.builder()
                .id(1L)
                .title("Test Task")
                .description("Test Description")
                .status(TaskStatus.TODO)
                .priority(TaskPriority.MEDIUM)
                .build();
    }

    @Test
    @DisplayName("getAllTasksForUser: should return all tasks for the user")
    void getAllTasksForUser_ShouldReturnAllTasks() {
        when(taskRepository.findByUserId(1L)).thenReturn(List.of(testTask));
        when(taskMapper.toResponse(testTask)).thenReturn(testTaskResponse);

        List<TaskResponse> result = taskService.getAllTasksForUser(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Test Task");
        verify(taskRepository, times(1)).findByUserId(1L);
    }

    @Test
    @DisplayName("getAllTasksForUser: should return empty list when user has no tasks")
    void getAllTasksForUser_ShouldReturnEmptyList() {
        when(taskRepository.findByUserId(99L)).thenReturn(List.of());

        List<TaskResponse> result = taskService.getAllTasksForUser(99L);

        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("getTaskById: should return task when it belongs to the user")
    void getTaskById_ShouldReturnTask_WhenExists() {
        when(taskRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testTask));
        when(taskMapper.toResponse(testTask)).thenReturn(testTaskResponse);

        TaskResponse result = taskService.getTaskById(1L, 1L);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getTitle()).isEqualTo("Test Task");
    }

    @Test
    @DisplayName("getTaskById: should throw ResourceNotFoundException when task not found")
    void getTaskById_ShouldThrow_WhenTaskNotFound() {
        when(taskRepository.findByIdAndUserId(99L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.getTaskById(99L, 1L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    @DisplayName("getTaskById: should throw ResourceNotFoundException when task belongs to another user")
    void getTaskById_ShouldThrow_WhenTaskBelongsToAnotherUser() {
        // findByIdAndUserId returns empty if task doesn't belong to this user
        when(taskRepository.findByIdAndUserId(1L, 2L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.getTaskById(1L, 2L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("createTask: should save and return the new task")
    void createTask_ShouldSaveAndReturnTask() {
        TaskRequest request = new TaskRequest();
        request.setTitle("New Task");
        request.setDescription("New Description");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(taskMapper.toEntity(request)).thenReturn(testTask);
        when(taskRepository.save(testTask)).thenReturn(testTask);
        when(taskMapper.toResponse(testTask)).thenReturn(testTaskResponse);

        TaskResponse result = taskService.createTask(request, 1L);

        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("Test Task");
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    @DisplayName("createTask: should throw ResourceNotFoundException when user does not exist")
    void createTask_ShouldThrow_WhenUserNotFound() {
        TaskRequest request = new TaskRequest();
        request.setTitle("New Task");

        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.createTask(request, 99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    @DisplayName("deleteTask: should delete the task when it belongs to the user")
    void deleteTask_ShouldDeleteTask_WhenExists() {
        when(taskRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testTask));

        taskService.deleteTask(1L, 1L);

        verify(taskRepository, times(1)).delete(testTask);
    }

    @Test
    @DisplayName("deleteTask: should throw when task does not belong to the user")
    void deleteTask_ShouldThrow_WhenTaskNotOwned() {
        when(taskRepository.findByIdAndUserId(1L, 2L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.deleteTask(1L, 2L))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(taskRepository, never()).delete(any());
    }
}
