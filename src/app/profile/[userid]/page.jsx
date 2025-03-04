'use client'
import {useEffect, useState} from 'react';
import { User, MessageSquare, Image, Eye, ThumbsUp, Paperclip, Globe, Phone, Mail, Calendar, Camera, Star, FileText } from 'lucide-react';
import Navbar from '../../dashboard/_components/navbar';
import { useRouter } from 'next/navigation';
import {getExperiences} from '../../actions/addExperience'
import { useParams } from 'next/navigation';
import { getPersonalProfiles } from '@/app/actions/addPersonalProfile';
import { getSkill } from '@/app/actions/addSkills';
import RatingsChart from '@/components/chart';
import Link from 'next/link';

export default function ProfilePage() {
    const router = useRouter();
    const { userid } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    console.log(userid);
    const [data, setData] = useState({
        // Default values before data fetches
        name: "",
        email: "",
        ProfileImage: "",
        Type: "",
        description: "",
        Github: "",
        Linkedin: "",
        Twitter: "",
        dob: "",
        resume:"",
        languages: [],
        frameworks: [],
        tools: []
    });
    
    const [experiences, setExperiences] = useState([]);
    const [skills, setSkills] = useState([]);
    
    useEffect(() => {
        let isMounted = true;
        
        const fetchData = async () => {
            if (!userid) return;
            
            setIsLoading(true);
            setError(null);
            
            try {
                // Use Promise.all to make all requests in parallel
                const [profileResponse, experiencesResponse, skillsResponse] = await Promise.all([
                    fetch(`/api/getProfile/${userid}`).then(res => {

                        if (!res.ok) throw new Error('Failed to fetch profile');
                       
                        return res.json();

                    }),
                    fetch(`/api/experiences/${userid}`).then(res => {
                        if (!res.ok) throw new Error('Failed to fetch experiences');
                        return res.json();
                    }),
                  
                ]);
                
                // Only update state if component is still mounted
                if (isMounted) {
                    if (profileResponse && profileResponse.success && profileResponse.profile) {
                        console.log("profile akash dudh",profileResponse);
                        setData(profileResponse.profile);
                    }
                    
                    if (experiencesResponse && experiencesResponse.success) {
                        setExperiences(experiencesResponse.experiences || []);
                        console.log('experiences',experiencesResponse.experiences);
                    }
                    
                    
                }
            } catch (error) {
                console.log("Error fetching data:", error.message||error);
                if (isMounted) {
                    setError(error.message || "An error occurred while fetching data");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };
        
        fetchData();
        
        // Cleanup function to prevent memory leaks
        return () => {
            isMounted = false;
        };
    }, [userid]);
    
    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Helper function to assign colors to skills dynamically
    const getColorForLanguage = (index) => {
        const colors = ["bg-yellow-500", "bg-blue-600", "bg-green-500", "bg-orange-500", "bg-purple-500"];
        return colors[index % colors.length];
    };
    
    const getColorForFramework = (index) => {
        const colors = ["bg-blue-500", "bg-red-500", "bg-green-600", "bg-cyan-500", "bg-indigo-600"];
        return colors[index % colors.length];
    };
    
    const getColorForTool = (index) => {
        const colors = ["bg-orange-600", "bg-green-500", "bg-blue-700", "bg-gray-700", "bg-pink-600"];
        return colors[index % colors.length];
    };

    return (
        <div className="min-h-screen bg-[#232a34]">
            <Navbar />
            <Link
  href="/dashboard/EditProfile"
  className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white text-lg font-semibold px-5 py-2 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 border border-blue-500"
>
  Edit Profile
</Link>


            <main className="container mx-auto px-6 py-8 bg-[#232a34]">
                <div className="rounded-xl shadow-md overflow-hidden mb-8 border-2 border-[#01a2e9]">
                    <div className="md:flex">
                        <div className="p-8 border flex flex-col items-center">
                            <div className="relative">
                                <img
                                    className="h-32 w-32 rounded-full border-4 object-cover"
                                    src={data.ProfileImage || "hbjjhvh"}
                                    alt="Profile"
                                />
                                <div className="absolute bottom-0 right-0 bg-green-400 h-4 w-4 rounded-full border-2 border-white"></div>
                            </div>
                            <h2 className="mt-4 text-xl font-bold text-white">{data.name || "User"}</h2>
                            <p className="text-[#01a2ea] font-medium">{data.Type || "Member"}</p>

                            <div className="mt-6 flex space-x-2">
                                <button className="bg-[#01a2ea] text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition">
                                    Follow
                                </button>
                                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition">
                                    Message
                                </button>
                            </div>

                            <div className="mt-4 w-full">
                               {data?.resume ?(  <Link className="w-full flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                                href={data?.resume}>
                                    
                                    View Resume
                                </Link>):(<p></p>)}
                            </div>

                            <div className="mt-6 flex space-x-4">
                                <a href={data.Twitter || "#"} className="text-[#01a2ea] hover:text-indigo-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                    </svg>
                                </a>
                                <a href={data.Github || "#"} className="text-[#01a2ea] hover:text-indigo-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                </a>
                                <a href={data.Linkedin || "#"} className="text-[#01a2ea] hover:text-indigo-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div className="p-8 flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-amber-50 rounded-lg p-4 flex items-center shadow-sm">
                                    <div className="bg-amber-100 rounded-full p-3 mr-4">
                                        <Star className="h-6 w-6 text-amber-500" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-800">{data.AvgRating || "3 Star"}</div>
                                        <div className="text-sm text-gray-500">Rating</div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 rounded-lg p-4 flex items-center shadow-sm">
                                    <div className="bg-blue-100 rounded-full p-3 mr-4">
                                        <ThumbsUp className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-800">1,203</div>
                                        <div className="text-sm text-gray-500">Likes</div>
                                    </div>
                                </div>

                                <div className="bg-red-50 rounded-lg p-4 flex items-center shadow-sm">
                                    <div className="bg-red-100 rounded-full p-3 mr-4">
                                        <MessageSquare className="h-6 w-6 text-red-500" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-800">3</div>
                                        <div className="text-sm text-gray-500">Attempted Mock Interviews</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center">
                                <h1 className='text-[#02a3ea] text-xl'>Description</h1>
                                <p className='text-white'>{data.description || "No description available"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <div className="rounded-xl shadow-md overflow-hidden border border-[#01a2e9]">
                            <div className="border border-[#01a2e9]">
                                <div className="flex">
                                    <button className="flex-1 py-4 px-6 text-center bg-[#01a2e9] text-white font-medium">
                                        About
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-6 bg-[#232a34]">
                                <div>
                                    <h3 className="text-white text-sm mb-1">Email address:</h3>
                                    <div className="flex items-center">
                                        <Mail className="h-4 w-4 text-[#01a2e9] mr-2" />
                                        <span className="text-white">{data.email || "Not provided"}</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-white text-sm mb-1">Gender:</h3>
                                    <div className="flex items-center">
                                        <User className="h-4 w-4 text-[#01a2e9] mr-2" />
                                        <span className="text-white">{data.Gender || "Not specified"}</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-white text-sm mb-1">Birthday:</h3>
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 text-[#01a2e9] mr-2" />
                                        <span className="text-white">{formatDate(data.dob) || "Not provided"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <div className="bg-[#232a34] rounded-xl shadow-md overflow-hidden mb-8 border border-[#01a2e9]">
                            <div className="p-6">
                                <div className="mb-8">
                                    {/* Tech Stack Section */}
                                    <div className="w-full border border-[#01a2e9] rounded-lg p-6 bg-[#2c3440] text-white">
                                        <h3 className="text-[#01a2e9] font-bold mb-4 text-lg">Programming Languages</h3>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {data.languages && data.languages.length > 0 ? 
                                                data.languages.map((tech, index) => (
                                                    <span 
                                                        key={index} 
                                                        className={`${getColorForLanguage(index)} text-white px-3 py-1 rounded-full text-sm font-medium`}
                                                    >
                                                        {tech}
                                                    </span>
                                                )) : 
                                                <span className="text-gray-400">No programming languages specified</span>
                                            }
                                        </div>
                                        
                                        <h3 className="text-[#01a2e9] font-bold mb-4 text-lg">Frameworks</h3>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {data.frameworks && data.frameworks.length > 0 ? 
                                                data.frameworks.map((tech, index) => (
                                                    <span 
                                                        key={index} 
                                                        className={`${getColorForFramework(index)} text-white px-3 py-1 rounded-full text-sm font-medium`}
                                                    >
                                                        {tech}
                                                    </span>
                                                )) : 
                                                <span className="text-gray-400">No frameworks specified</span>
                                            }
                                        </div>
                                        
                                        <h3 className="text-[#01a2e9] font-bold mb-4 text-lg">Tools</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {data.tools && data.tools.length > 0 ? 
                                                data.tools.map((tech, index) => (
                                                    <span 
                                                        key={index} 
                                                        className={`${getColorForTool(index)} text-white px-3 py-1 rounded-full text-sm font-medium`}
                                                    >
                                                        {tech}
                                                    </span>
                                                )) : 
                                                <span className="text-gray-400">No tools specified</span>
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    {/* Stats sections remain unchanged */}
                                    <div className="bg-[#232a34] p-6 rounded-lg shadow-sm border border-[#01a2e9]">
                                        <h3 className="text-lg font-bold text-white mb-4">Social Stats</h3>

                                        <div className="flex justify-center items-center h-64">
                                            <div className="w-full max-w-xs">
                                                <div className="relative pt-1">
                                                    <div className="flex mb-2 items-center justify-between">
                                                        <div>
                                                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-amber-600 bg-amber-200">
                                                                Shots View
                                                            </span>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-xs font-semibold inline-block text-amber-400">
                                                                65%
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-amber-200">
                                                        <div style={{ width: "65%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500"></div>
                                                    </div>
                                                </div>

                                                <div className="relative pt-1">
                                                    <div className="flex mb-2 items-center justify-between">
                                                        <div>
                                                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                                                Likes
                                                            </span>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-xs font-semibold inline-block text-blue-400">
                                                                30%
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                                                        <div style={{ width: "30%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                                                    </div>
                                                </div>

                                                <div className="relative pt-1">
                                                    <div className="flex mb-2 items-center justify-between">
                                                        <div>
                                                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                                                                Comments
                                                            </span>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-xs font-semibold inline-block text-red-400">
                                                                15%
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200">
                                                        <div style={{ width: "15%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#232a34] p-6 rounded-lg shadow-sm border border-[#01a2e9]">
                                        <h3 className="text-lg font-bold text-white mb-4">Monthly Activity</h3>

                                      <RatingsChart/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}