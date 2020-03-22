pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/math/SafeMath.sol";


contract TasksApp is AragonApp {
    using SafeMath for uint256;

    /// Events
    event TaskAssigned(bytes32 languageGroup, string userId, string taskId);

    ///Types

    enum Status {New, Assigned, Completed}

    struct Task {
        Status status;
    }

    /// State
    uint256 public value;

    mapping(string => Task) tasks;

    /**
     * Key: Language group (en-es).
     * Value:
        Key: User id
        Value: Task id
     */
    mapping(bytes32 => mapping(string => string)) taskRegistry;

    // mapping(bytes32 => Task) public tasks;
    // mapping(address => mapping(bytes32 => bool)) private languageGroupUser;
    // mapping(address => AssignedTasks) assignedTasksRegistry;

    //If we need to transverse tasks we can use this:
    // mapping(uint256 => bytes32) private taskIndex;
    // uint256 private taskIndexLength;

    /// ACL
    bytes32 constant public ASSIGN_TASK_ROLE = keccak256("ASSIGN_TASK_ROLE");

    string private constant ERROR_ASSIGNED_TASK = "TASK_ALREADY_ASSIGNED";
    string private constant ERROR_USER_HAS_TASK = "USER_HAS_TASK";

    function initialize() public onlyInit {
        initialized();
    }

    modifier taskAlreadyAssigned(bytes32 _languageGroup, string _userId, string _taskId) {
        require(tasks[_taskId].status != Status.Assigned, ERROR_ASSIGNED_TASK);
        _;
    }

    modifier userAlreadyHasTask(bytes32 _languageGroup, string _userId) {
        bytes memory str = bytes(taskRegistry[_languageGroup][_userId]);
        require(str.length == 0, ERROR_USER_HAS_TASK);
        _;
    }

    /**
     * @notice Assignment of the translation task.
     * @param _taskId The task's id.
     * @param _languageGroup User's translation group
     * @param _userId The user's id.
     */

    function assignTask(
        bytes32 _languageGroup,
        string _userId,
        string _taskId
    )
    external
    taskAlreadyAssigned(_languageGroup, _userId, _taskId)
    userAlreadyHasTask(_languageGroup, _userId)
    auth(ASSIGN_TASK_ROLE)
    {
        taskRegistry[_languageGroup][_userId] = _taskId;
        tasks[_taskId].status = Status.Assigned;
        emit TaskAssigned(_languageGroup, _userId, _taskId);
    }

    function getUserTask(bytes32 _languageGroup, string _userId) external view returns(string) {
        return taskRegistry[_languageGroup][_userId];
    }
}
