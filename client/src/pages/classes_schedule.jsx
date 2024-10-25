import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing

export default function ClassesSchedule() {
    const [studentClasses, setStudentClasses] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [historyData, setHistoryData] = useState([]); // State for class history
    const userName = localStorage.getItem("user_name");
    const navigate = useNavigate(); // Use navigate from react-router

    useEffect(() => {
        const fetchStudentClasses = async () => {
            try {
                const response = await axios.get(
                    `http://103.18.23.62:8080/apeks/apps/erp/classschedule/getdata/?P_EMAIL=${userName}`
                );
                setStudentClasses(response.data.items);
            } catch (error) {
                console.error("Error fetching class schedule:", error);
            }
        };
        fetchStudentClasses();
    }, [userName]);

    const handleHistoryClick = async (stdId) => {
        setModalVisible(true);
        console.log("student id is :", stdId);
        try {
            const response = await axios.get(`http://103.18.23.62:8080/apeks/apps/erp/classschedule/getdata/?P_EMAIL=${userName}&P_STUDENT_ID=${stdId}`);
            const fetchedHistoryData = response.data.items; // Store fetched data in a variable
            setHistoryData(fetchedHistoryData); // Update state with history data
            console.log("history data is:", fetchedHistoryData);
        } catch (error) {
            console.error("Error fetching class history:", error);
        }
    };

    const closeModal = () => {
        setModalVisible(false);
        setHistoryData([]); // Clear history data when closing modal
    };

    const handleAddStudentClick = () => {
        navigate("/add_student"); // Navigate to the Add Student page
    };

    return (
        <DashboardLayout>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Student Classes</h2>

                {/* Add Student Button */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={handleAddStudentClick}
                        className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600 transition"
                    >
                        Add Student
                    </button>
                </div>

                <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-800 text-white text-left text-sm uppercase">
                            <th className="px-4 py-3 border">Student ID</th>
                            <th className="px-4 py-3 border">Student Name</th>
                            <th className="px-4 py-3 border">Course Name</th>
                            <th className="px-4 py-3 border">Class History</th>
                            <th className="px-4 py-3 border">Teacher Name</th>
                            <th className="px-4 py-3 border">Supervisor Name</th>
                            <th className="px-4 py-3 border">Status</th>
                            <th className="px-4 py-3 border">Registration Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentClasses.map((studentClass, index) => (
                            <tr
                                key={index}
                                className={`border-b text-sm ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                            >
                                <td className="px-4 py-3 border">{studentClass.student_id}</td>
                                <td className="px-4 py-3 border">{studentClass.student_name}</td>
                                <td className="px-4 py-3 border">{studentClass.course_name}</td>
                                <td className="px-4 py-3 border">
                                    <button
                                        className="text-blue-500 underline"
                                        onClick={() => handleHistoryClick(studentClass.student_id)}
                                    >
                                        History
                                    </button>
                                </td>
                                <td className="px-4 py-3 border">{studentClass.teacher_name}</td>
                                <td className="px-4 py-3 border">{studentClass.supervisor_name}</td>
                                <td className="px-4 py-3 border">{studentClass.class_status}</td>
                                
                                <td className="px-4 py-3 border">
                                    {new Date(studentClass.registration_date).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Class History */}
            {modalVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 p-6" style={{ zIndex: 9999 }}>
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] h-[90%] max-w-none overflow-auto">
                        <h3 className="text-xl font-semibold mb-4">Class History</h3>
                        <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300">
                            <thead>
                                <tr className="bg-gray-800 text-white text-left text-sm uppercase">
                                    <th className="px-4 py-3 border">Student ID</th>
                                    <th className="px-4 py-3 border">Student Name</th>
                                    <th className="px-4 py-3 border">Class Status</th>
                                    <th className="px-4 py-3 border">Family ID</th>
                                    <th className="px-4 py-3 border">Family Name</th>
                                    <th className="px-4 py-3 border">Registration Date</th>
                                    <th className="px-4 py-3 border">Relation Type</th>
                                    <th className="px-4 py-3 border">Supervisor Name</th>
                                    <th className="px-4 py-3 border">Teacher Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyData.map((history, index) => (
                                    <tr key={index} className="border-b text-sm bg-gray-50">
                                        <td className="px-4 py-3 border">{history.student_id}</td>
                                        <td className="px-4 py-3 border">{history.student_name}</td>
                                        <td className="px-4 py-3 border">{history.class_status}</td>
                                        <td className="px-4 py-3 border">{history.family_id}</td>
                                        <td className="px-4 py-3 border">{history.family_name}</td>
                                        <td className="px-4 py-3 border">
                                            {new Date(history.registration_date).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </td>
                                        <td className="px-4 py-3 border">{history.relation_type}</td>
                                        <td className="px-4 py-3 border">{history.supervisor_name}</td>
                                        <td className="px-4 py-3 border">{history.teacher_name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={closeModal} className="mt-4 bg-red-500 text-white py-2 px-4 rounded shadow hover:bg-red-600">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
