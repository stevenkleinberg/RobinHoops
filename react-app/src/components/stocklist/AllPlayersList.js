import React, { useState, useEffect } from "react";
import PlayerCard from "./PlayerCard";

function AllPlayersList({ players }) {
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
    <div className='stocklist_players flex-column '>
            <div className='stockListHeader flex-row'  onClick={openDropdown}>
                <p>All Players</p>
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
                    {players.map(player => (
                        <PlayerCard player={player} key={player.id} />
                    ))}
                </div>
            )}
        </div>
  )
}

export default AllPlayersList
