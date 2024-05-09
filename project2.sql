-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 09, 2024 at 10:43 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project2`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `adminid` int(11) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`adminid`, `email`, `password`) VALUES
(1, 'master@gmail.com	', 'master123'),
(2, 'dhruv@gmail.com', '123456');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `rollno` varchar(20) NOT NULL,
  `grno` varchar(20) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) NOT NULL,
  `class` varchar(50) DEFAULT NULL,
  `batch` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`rollno`, `grno`, `name`, `email`, `password`, `class`, `batch`) VALUES
('111', '1234567', 'Mohit Pipaliya', 'mohit@gmail.com', 'mohit123', '12', 'morning'),
('222', '12345678', 'Sahil', 'sahil@gmail.com', 'sahil123', '12', 'morning'),
('333', '1234567', 'Mukesh', 'mukesh@gmail.com', 'mukesh123', '12', 'morning'),
('444', '2345678', 'Tushar', 'tushar@gmail.com', '123456', '12', 'morning'),
('555', '1234567', 'Dhruvi', 'dhruvi@gmail.com', '123456', '12', 'morning'),
('666', '12345678', 'Dhruv', 'dhruv@gmail.com', '123456', '12', 'morning'),
('777', '12345678', 'Kunjal', 'kunjal@gmail.com', 'kunjal123', '12', 'morning'),
('999', '12345678', 'Raj', 'raj@gmail.com', '123456', '12', 'morning');

-- --------------------------------------------------------

--
-- Table structure for table `tblresult`
--

CREATE TABLE `tblresult` (
  `result_id` int(11) NOT NULL,
  `rollno` varchar(20) DEFAULT NULL,
  `subject1` float DEFAULT NULL,
  `subject2` float DEFAULT NULL,
  `subject3` float DEFAULT NULL,
  `subject4` float DEFAULT NULL,
  `subject5` float DEFAULT NULL,
  `total` float DEFAULT NULL,
  `per` float DEFAULT NULL,
  `grade` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblresult`
--

INSERT INTO `tblresult` (`result_id`, `rollno`, `subject1`, `subject2`, `subject3`, `subject4`, `subject5`, `total`, `per`, `grade`) VALUES
(2, '111', 90, 89, 89, 90, 80, 438, 87.6, 'A'),
(3, '222', 90, 89, 80, 67, 70, 396, 79.2, 'B+'),
(4, '333', 56, 78, 67, 50, 50, 301, 60.2, 'B'),
(5, '444', 44, 55, 67, 56, 67, 289, 57.8, 'C'),
(6, '555', 65, 90, 78, 89, 80, 402, 80.4, 'A'),
(7, '666', 67, 89, 90, 67, 56, 369, 73.8, 'B+'),
(8, '777', 89, 67, 56, 89, 90, 391, 78.2, 'B+'),
(9, '999', 89, 90, 67, 56, 78, 380, 76, 'B+');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`adminid`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`rollno`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `tblresult`
--
ALTER TABLE `tblresult`
  ADD PRIMARY KEY (`result_id`),
  ADD KEY `rollno` (`rollno`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `adminid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tblresult`
--
ALTER TABLE `tblresult`
  MODIFY `result_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tblresult`
--
ALTER TABLE `tblresult`
  ADD CONSTRAINT `tblresult_ibfk_1` FOREIGN KEY (`rollno`) REFERENCES `student` (`rollno`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
