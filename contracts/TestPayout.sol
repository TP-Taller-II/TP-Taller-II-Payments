// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Ubademy is Ownable {

    struct Course {
        uint incoming_balance;
        uint outgoing_balance;
        uint256 last_available;
        bytes32 key;
    }

    mapping(uint => Course) public courses;
    uint public balance;

    function NewCourse(uint course_id, uint256 date, bytes32 password) external onlyOwner {
        require(courses[course_id].last_available == 0, "Course already exists.");

        bytes32 hashed_pass = keccak256(abi.encode(course_id, password));
        Course memory new_course = Course(0, 0, date, hashed_pass);
        courses[course_id] = new_course;
    }

    function Deposit(uint course_id, uint amount) external onlyOwner {
        require(courses[course_id].last_available != 0, "Course doesn't exist.");
        while (courses[course_id].last_available + 31 days < block.timestamp) {
            courses[course_id].last_available = courses[course_id].last_available + 31 days;
            courses[course_id].outgoing_balance += courses[course_id].incoming_balance;
            courses[course_id].incoming_balance = 0;
        }
        
        uint modulo = amount % 2;
        amount = amount / 2;

        courses[course_id].incoming_balance += amount;
        balance += amount + modulo;
    }

    function Extract(uint course_id, uint password) external {
        bytes32 hashed_pass = keccak256(abi.encode(course_id, password));
        require(courses[course_id].last_available != 0, "Course doesn't exist.");
        require(hashed_pass == courses[course_id].key, "Wrong Password.");
        require(courses[course_id].last_available > block.timestamp, "Too early to extract money.");


        IERC20 usdt = IERC20(address(0xdAC17F958D2ee523a2206206994597C13D831ec7));

        usdt.transfer(msg.sender, courses[course_id].outgoing_balance);
        courses[course_id].outgoing_balance = 0;
    }

    function Refund(uint course_id, uint amount, address user) external onlyOwner {
        require(courses[course_id].last_available != 0, "Course doesn't exist.");
        
        IERC20 usdt = IERC20(address(0xdAC17F958D2ee523a2206206994597C13D831ec7));

        usdt.transfer(user, amount);

        uint modulo = amount % 2;
        amount = amount / 2;

        courses[course_id].incoming_balance -= amount;
        balance -= amount + modulo;
    }

    // Data Getting

    function getCourseIncomingBalance(uint course_id) public view returns (uint) {
        require(courses[course_id].last_available != 0, "Course doesn't exist.");

        return courses[course_id].incoming_balance;
    }

    function getCourseOutgoingBalance(uint course_id) public view returns (uint) {
        require(courses[course_id].last_available != 0, "Course doesn't exist.");

        return (courses[course_id].outgoing_balance);
    }

    // Debug 

    function updateDate(uint course_id, uint256 date) public onlyOwner {
        require(courses[course_id].last_available != 0, "Course doesn't exist.");
        require(date != 0, "Date can't be 0.");
        courses[course_id].last_available = date;
        courses[course_id].outgoing_balance += courses[course_id].incoming_balance;
        courses[course_id].incoming_balance = 0;
    }
}