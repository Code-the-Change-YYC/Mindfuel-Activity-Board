import { User } from "../utils/User";
import { useEffect, useState } from "react";
import _ from "lodash";

const useProcessedUsers = (
  liveUsers: User[],
  historicalUsers: User[] | null
) => {
  const [processedUsers, setProcessedUsers] = useState<User[] | null>(null);

  useEffect(() => {
    // Group a user list by location
    const groupByLocation = (users: any[]): { [location: string]: any } => {
      return users.reduce((storage, user) => {
        // Create a string key based on combination of lat/long
        const group = `${user.payload.location.latitude}_${user.payload.location.longitude}`;
        storage[group] = storage[group] || [];
        storage[group].push(user);
        return storage;
      }, {});
    };

    const getProcessedUsers = (users: User[]) => {
      const processedUsers: User[] = [];

      // Group users by location
      const groupedUsers = groupByLocation(users);

      // For each location keep the latest user by date
      for (const key in groupedUsers) {
        const users: User[] = groupedUsers[key];
        let latestUser: User = users[0];

        users.forEach((user) => {
          if (!_.isNil(user.date) && !_.isNil(latestUser.date)) {
            latestUser = user.date > latestUser.date ? user : latestUser;
          }
        });

        processedUsers.push(latestUser);
      }

      // Sort in descending order by latitude to avoid overlapping on map
      processedUsers.sort(
        (a: User, b: User) =>
          b.payload.location.latitude - a.payload.location.latitude
      );

      setProcessedUsers(processedUsers);
    };

    getProcessedUsers(_.isNil(historicalUsers) ? liveUsers : historicalUsers);
  }, [liveUsers, historicalUsers]);

  return processedUsers;
};

export default useProcessedUsers;
