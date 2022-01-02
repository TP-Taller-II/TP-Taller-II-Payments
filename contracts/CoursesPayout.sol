// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CoursesPayout is Ownable {

    struct Course {
        uint incoming_balance;
        uint outgoing_balance;
        uint256 last_available;
        bytes32 key;
    }

    mapping(bytes32 => Course) public courses;
    uint public balance;
    uint public available_balance;
    IERC20 usdt;

    constructor(IERC20 _tokenContract) public {
        usdt = _tokenContract;
    }

    function NewCourse(bytes32 course_id, uint256 date, bytes32 password) external onlyOwner {
        require(courses[course_id].last_available == 0, "Course already exists.");

        bytes32 hashed_pass = keccak256(abi.encode(course_id, password));
        Course memory new_course = Course(0, 0, date, hashed_pass);
        courses[course_id] = new_course;
    }

    function DeleteCourse(bytes32 course_id, bytes32 password) external onlyOwner {
        bytes32 hashed_pass = keccak256(abi.encode(course_id, password));
        require(courses[course_id].last_available != 0, "Course doesn't exists.");
        require(hashed_pass == courses[course_id].key, "Wrong Password.");
        
        courses[course_id] = Course(0, 0, 0, 0);
    }

    function Deposit(bytes32 course_id, uint amount) external onlyOwner {
        require(courses[course_id].last_available != 0, "Course doesn't exist.");
        while (courses[course_id].last_available + 31 days < block.timestamp) {
            courses[course_id].last_available = courses[course_id].last_available + 31 days;
            courses[course_id].outgoing_balance += courses[course_id].incoming_balance;
            available_balance += courses[course_id].incoming_balance;
            courses[course_id].incoming_balance = 0;
        }
        
        uint modulo = amount % 2;
        amount = amount / 2;

        courses[course_id].incoming_balance += amount;
        balance += amount + modulo;
        available_balance += modulo;
    }

    function ExtractCourse(bytes32 course_id, uint password) external {
        bytes32 hashed_pass = keccak256(abi.encode(course_id, password));
        require(courses[course_id].last_available != 0, "Course doesn't exist.");
        require(hashed_pass == courses[course_id].key, "Wrong Password.");

        usdt.transfer(msg.sender, courses[course_id].outgoing_balance);
        courses[course_id].outgoing_balance = 0;
    }

    function Extract(address to, uint amount) external onlyOwner {
        require(available_balance >= amount, "We don't have enough funds");

        usdt.transfer(to, amount);
    }

    function Refund(bytes32 course_id, uint amount, address user) external onlyOwner {
        require(courses[course_id].last_available != 0, "Course doesn't exist.");
        uint modulo = amount % 2;
        uint sub_amount = amount / 2;
        
        require(courses[course_id].incoming_balance >= sub_amount, "Course doesn't have enough to refund.");
        usdt.transfer(user, amount);

        courses[course_id].incoming_balance -= sub_amount;
        balance -= sub_amount + modulo;
        available_balance -= modulo;
    }

    // Data Getting

    function getCourseIncomingBalance(bytes32 course_id) public view returns (uint) {
        require(courses[course_id].last_available != 0, "Course doesn't exist.");

        return courses[course_id].incoming_balance;
    }

    function getCourseOutgoingBalance(bytes32 course_id) public view returns (uint) {
        require(courses[course_id].last_available != 0, "Course doesn't exist.");

        return (courses[course_id].outgoing_balance);
    }

    // Debug 

    function updateDate(bytes32 course_id, uint256 date) public onlyOwner {
        require(courses[course_id].last_available != 0, "Course doesn't exist.");
        require(date != 0, "Date can't be 0.");
        courses[course_id].last_available = date;
        courses[course_id].outgoing_balance += courses[course_id].incoming_balance;
        available_balance += courses[course_id].incoming_balance;
        courses[course_id].incoming_balance = 0;
    }
}