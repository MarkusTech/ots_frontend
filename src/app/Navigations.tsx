"use client";

import React from "react"
import { useRouter } from 'next/navigation'
import { useState } from "react";
import SalesQoutation from "./Transaction/SalesQoutation/SalesQoutation";

export default function Navigations(){

    // Declaration

    const router = useRouter(); //Router


    const [rounterName, setRounterName] = React.useState('');

    // For submenu states
    const [subsubmenuOpen, setSubsubmenuOpen] = useState(false);
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const [submenuOpenInq, setSubmenuOpenInq] = useState(false);
    const [submenuOpenReports, setSubmenuOpenReports] = useState(false);
    const [submenuOpenSetUp, setSubmenuOpenSetUp] = useState(false);
    const [routerName, setRouterName] = useState('');
    
    // submenu transaction
    const [subsubmenuOpen1, setSubsubmenuOpen1] = useState('');
    const [subsubmenuOpen2, setSubsubmenuOpen2] = useState('');

    
    // For span active
    const [spanName1, setSpanName1] = useState('');
    const [spanName2, setSpanName2] = useState('');
    const [spanName3, setSpanName3] = useState('');
    const [spanName4, setSpanName4] = useState('');
  
    // End Of Declaration

    function handleRounter(page: React.SetStateAction<string>) {
        
        if(page === 'transaction') {
            setRounterName(page);
            console.log('transaction', page)
            setSubmenuOpen(!submenuOpen);
            setSubmenuOpenInq(false);
            setSubmenuOpenReports(false);
            setSubmenuOpenSetUp(false);

            setSpanName1('active');
            setSpanName2('');
            setSpanName3('');
            setSpanName4('');

        }else if(page === 'inquiry') {
            setRounterName(page);
            console.log('items')
            setSubmenuOpenInq(!submenuOpenInq);
            setSubmenuOpen(false);
            setSubmenuOpenReports(false);
            setSubmenuOpenSetUp(false);

            setSpanName1('');
            setSpanName2('active');
            setSpanName3('');
            setSpanName4('');

        }else if(page === 'reports') {
            setRounterName(page);
            // router.push('../Reports')
            console.log('reports')
            setSubmenuOpenReports(!submenuOpenReports);
            setSubmenuOpen(false);
            setSubmenuOpenInq(false);
            setSubmenuOpenSetUp(false);

            setSpanName1('');
            setSpanName2('');
            setSpanName3('active');
            setSpanName4('');

        }else if(page === 'setup') {
            setRounterName(page);
            // router.push('../Setup')
            console.log('setup')
            setSubmenuOpenSetUp(!submenuOpenSetUp);
            setSubmenuOpen(false);
            setSubmenuOpenInq(false);
            setSubmenuOpenReports(false);

            setSpanName1('');
            setSpanName2('');
            setSpanName3('');
            setSpanName4('active');
            
        }

    }

    function handleRounter2(page: React.SetStateAction<string>) {

        let split = window.location.pathname.split('/');
        
        if(page === 'salesqoutation') {
            if(window.location.pathname === '/Transaction/SalesQoutation') {
                // router.push('./SalesOrder/');
            }else{
                if(split[1] === 'Transaction') {
                    router.push('./SalesQoutation/');
                    setSubsubmenuOpen1('active');
                    setSubsubmenuOpen2('');
                }else{
                    console.log('salesqoutation');
                    router.push('./Transaction/SalesQoutation/');
                    setSubsubmenuOpen1('active');
                    setSubsubmenuOpen2('');
                }
            }
        }else if(page === 'salesorder') {
            if(window.location.pathname === '/Transaction/SalesOrder') {
                // router.push('./SalesOrder/');
            }else{
                if(split[1] === 'Transaction') {
                    router.push('./SalesOrder/');
                    setSubsubmenuOpen1('');
                    setSubsubmenuOpen2('active');
                }else{
                    console.log('salesorder');
                    router.push('./Transaction/SalesOrder/');
                    setSubsubmenuOpen1('');
                    setSubsubmenuOpen2('active');
                }
            }
        }
    }

    const handleSubmenuClick = (e:any) => {
        e.stopPropagation(); // Prevent the event from reaching the parent li
      };
    
    return(
        <>
            <div className="w-[200px]">
                <ul>
                    <li className={`p-2 linav ${routerName === 'transaction' ? 'active' : ''}`} onClick={() => handleRounter('transaction')}>
                        <span className={`${spanName1}`}>Transaction</span>
                            {submenuOpen && (
                            <ul className="submenu p-2">
                                <li onClick={handleSubmenuClick}>
                                    <a onClick={()=> handleRounter2('salesqoutation')} className={`${subsubmenuOpen1}`}>Sales Quotation</a>
                                </li>
                                <li onClick={handleSubmenuClick}>
                                    <a onClick={()=> handleRounter2('salesorder')} className={`${subsubmenuOpen2}`}>Sales Order</a>
                                </li>
                                {/* Add more submenu items as needed */}
                            </ul>
                            )}
                    </li>
                    <li className={`p-2 linav ${routerName === 'inquiry' ? 'active' : ''}`} onClick={() => handleRounter('inquiry')}>
                        <span className={`${spanName2}`}>Inquiry</span>
                        {submenuOpenInq && (
                            <ul className="submenu p-2">
                                <li>Price list & Stocks Inquiry</li>
                                <li>Credit Line Monitoring</li>
                                {/* Add more submenu items as needed */}
                            </ul>
                        )}
                    </li>
                    <li className={`p-2 linav ${routerName === 'reports' ? 'active' : ''}`} onClick={() => handleRounter('reports')} >
                        <span className={`${spanName3}`}>Reports</span>
                        {submenuOpenReports && (
                            <ul className="submenu p-2">
                                <li>Price list & Stocks Inquiry</li>
                                <li>Credit Line Monitoring</li>
                                {/* Add more submenu items as needed */}
                            </ul>
                        )}
                    </li>
                    <li className={`p-2 linav ${routerName === 'setup' ? 'active' : ''}`} onClick={() => handleRounter('setup')} >
                        <span className={`${spanName4}`}>Set Up</span>
                        {submenuOpenSetUp && (
                            <ul className="submenu p-2">
                                <li>Users</li>
                                <li onClick={() => handleRounter('approval')}>
                                    Approval
                                    {submenuOpenSetUp && (
                                        <ul className="submenu p-2">
                                            <li>Price list & Stocks Inquiry</li>
                                            <li>Credit Line Monitoring</li>
                                            {/* Add more submenu items as needed */}
                                        </ul>
                                    )}
                                </li>
                                {/* Add more submenu items as needed */}
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </>
    )
}