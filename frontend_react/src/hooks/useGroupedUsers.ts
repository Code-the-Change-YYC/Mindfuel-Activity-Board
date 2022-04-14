import { User } from "../utils/User";
import { useEffect, useState } from "react";
import _ from "lodash";

const useGroupedUsers = (
  liveUsers: User[],
  historicalUsers: User[] | null
): Record<string, User[]> | null => {
  const [groupedUsers, setGroupedUsers] = useState<Record<string, User[]> | null>(null);

  useEffect(() => {
    // Group a user list by location
    const groupByLocation = (users: User[]): Record<string, User[]> => {
      return users.reduce((map: Record<string, User[]>, user) => {
        // Create a string key based on combination of lat/long
        const group = `${user.payload.location.latitude}, ${user.payload.location.longitude}`;
        map[group] = map[group] || [];
        map[group].push(user);
        return map;
      }, {});
    };

    const getGroupedUsers = (users: User[]) => {
      // Group users by location
      const groupedUsers = groupByLocation(users);
      
      // Sort users in descending order by date at each location
      for (const locKey in groupedUsers) {
        groupedUsers[locKey].sort((a: User, b: User) => b.date - a.date);
      }

      setGroupedUsers(groupedUsers);
    };

    const users = _.isNil(historicalUsers) ? liveUsers : historicalUsers;

    // Sort users in descending order by latitude to avoid overlapping on the map
    users.sort((a: User, b: User) => {
      // Sort by longitude if latitudes are the same
      if (a.payload.location.latitude === b.payload.location.latitude) {
        return a.payload.location.longitude - b.payload.location.longitude;
      }
      return b.payload.location.latitude - a.payload.location.latitude;
    });

    getGroupedUsers(users);
  }, [liveUsers, historicalUsers]);

  return groupedUsers;
};

export default useGroupedUsers;
