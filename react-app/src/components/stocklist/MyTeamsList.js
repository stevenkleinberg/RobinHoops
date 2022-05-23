import React, { useState, useEffect } from "react";
import MyTeamStockCard from "./MyTeamStockCard";
function MyTeamsList({team_stocks}) {
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
    if(!team_stocks.length){
        return (
            <></>
        )
    }
    return (
        <div className='stocklist_teams flex-column '>
            <div className='stockListHeader flex-row' onClick={openDropdown}>
                <p>My Teams</p>
                {showDropdown && (
                    <div className='dropdown_btn_up' >
                        &#10148;
                    </div>
                )}
                {!showDropdown && (
                    <div className='dropdown_btn_down' >
                        &#10148;
                    </div>
                )}
            </div>
            {showDropdown && (
                <div className='stocklist_dropdown'>
                    {team_stocks.map(team_stock => (
                        <MyTeamStockCard team_stock={team_stock} key={team_stock.id} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyTeamsList
