import React from 'react';
import { Link } from 'react-router-dom';
import { UsepublicContext } from './Context';

const SideBar = () => {
    const { sidebarState, setSidebarState } = UsepublicContext();
    
    return (
        <div>
            {sidebarState &&
                <div className="w-[250px] lg:w-[300px]  fixed top-0 md:relative bg-white px-4 py-[100px] h-full">
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2 items-center text-[#6B7280] cursor-pointer rounded-md px-2 py-1">
                            <i className="ri-home-2-line text-[25px]"></i>
                            <p className="text-[20px]">Home</p>
                        </div>
                        <Link to="/EmployeeList">
                            <div className="flex gap-2 items-center bg-blue-600 cursor-pointer text-white rounded-md px-2 py-1">
                                <i className="ri-group-line text-[25px]"></i>
                                <p className="text-[20px]">Employee</p>
                            </div>
                        </Link>
                       
                        
                      
                    
                     <Link to='/'>
                        <div className="flex gap-2 items-center text-[#6B7280] cursor-pointer px-2 py-1">
                            <i className="ri-logout-box-r-line text-[25px]"></i>
                            <p className="text-[20px]">Logout</p>
                        </div></Link>  
                    </div>
                </div>
            }
            <div className="w-[250px] lg:w-[300px] hidden  md:block  top-0  bg-white px-4 py-[100px] h-full">
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2 items-center text-[#6B7280] cursor-pointer rounded-md px-2 py-1">
                            <i className="ri-home-2-line text-[25px]"></i>
                            <p className="text-[20px]">Home</p>
                        </div>
                        <Link to="/EmployeeList">
                            <div className="flex gap-2 items-center bg-blue-600 cursor-pointer text-white rounded-md px-2 py-1">
                                <i className="ri-group-line text-[25px]"></i>
                                <p className="text-[20px]">Employee</p>
                            </div>
                        </Link>
                       
                       
                       
                       
                       <Link to='/'>
                        <div className="flex gap-2 items-center text-[#6B7280] cursor-pointer px-2 py-1">
                            <i className="ri-logout-box-r-line text-[25px]"></i>
                            <p className="text-[20px]">Logout</p>
                        </div></Link>
                    </div>
                </div>
        </div>
    );
};

export default SideBar;
