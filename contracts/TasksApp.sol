pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/math/SafeMath.sol";


contract TasksApp is AragonApp {
    using SafeMath for uint256;

    /// Events
    event Increment(address indexed entity, uint256 step);
    event Decrement(address indexed entity, uint256 step);
    event TaskAssigned(bytes32 _languageGroup, string _userId, string _taskId);

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
    bytes32 constant public INCREMENT_ROLE = keccak256("INCREMENT_ROLE");
    bytes32 constant public DECREMENT_ROLE = keccak256("DECREMENT_ROLE");
    bytes32 constant public ASSIGN_TASK_ROLE = keccak256("ASSIGN_TASK_ROLE");

    string private constant ERROR_ASSIGNED_TASK = "TASK_ALREADY_ASSIGNED";

    function initialize() public onlyInit {
        initialized();
    }

    modifier taskAlreadyAssigned(bytes32 _languageGroup, string _userId, string _taskId) {
        require(tasks[_taskId].status != Status.Assigned, ERROR_ASSIGNED_TASK);
        _;
    }

    /**
     * @notice Assign `_taskId` to the user `_userId` who belongs to the group `_languageGroup`.
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
    auth(ASSIGN_TASK_ROLE)
    {
        taskRegistry[_languageGroup][_userId] = _taskId;
        tasks[_taskId].status = Status.Assigned;
        emit TaskAssigned(_languageGroup, _userId, _taskId);
    }



        /**
     * @notice Increment the counter by `step`
     * @param step Amount to increment by
     */
    function increment(uint256 step) external auth(INCREMENT_ROLE) {
        value = value.add(step);
        emit Increment(msg.sender, step);
    }

    /**
     * @notice Decrement the counter by `step`
     * @param step Amount to decrement by
     */
    function decrement(uint256 step) external auth(DECREMENT_ROLE) {
        value = value.sub(step);
        emit Decrement(msg.sender, step);
    }
}
