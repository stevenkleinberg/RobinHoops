import React, { useState, useEffect } from "react";
import StockCard from './StockCard'

function TeamStockList({ teams }) {
    const [showDropdown, setShowDropdown] = useState(false);

    const openDropdown = () => {
        if (showDropdown) return;
        setShowDropdown(true);
    };

    useEffect(() => {
        if (!showDropdown) return;

        const closeDropdown = () => {
            setShowDropdown(false);
        };

        document.addEventListener("click", closeDropdown);

        return () => document.removeEventListener("click", closeDropdown);
    }, [showDropdown]);

    return (
        <div className='stocklist_teams flex-column '>
            <div className='stockListHeader flex-row'>
                <p>Team Stocks</p>
                <div className='dropdown_btn' onClick={openDropdown}>
                    &or;
                </div>
            </div>
            {showDropdown && (
                <div className='stocklist_dropdown'>
                    {teams.map(team => (
                        <StockCard team={team} key={team.id} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default TeamStockList
