
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, setSort, setFilter } from '../slices/userSlices';
import InfiniteScroll from 'react-infinite-scroll-component';

const UserList = () => {
  const dispatch = useDispatch();
  const { users, loading, hasMore, sort, filter } = useSelector((state) => state.users);

  const fetchMoreUsers = useCallback(() => {
    if (!loading && hasMore) {
      const skip = users.length;
      dispatch(fetchUsers({ skip, limit: 10 }));
    }
  }, [loading, hasMore, users.length, dispatch]);

  useEffect(() => {
    dispatch(fetchUsers({ skip: 0, limit: 10 }));
  }, [dispatch]);

  const handleSort = (key) => {
    dispatch(setSort({ key, order: sort.order === 'asc' ? 'desc' : 'asc' }));
  };

  const handleFilter = (e) => {
    const { name, value } = e.target;
    dispatch(setFilter({ ...filter, [name]: value }));
  };

  const filteredUsers = users
    .filter(user => !filter.gender || user.gender === filter.gender)
    .filter(user => !filter.country || user.country === filter.country);

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a[sort.key] < b[sort.key]) return sort.order === 'asc' ? -1 : 1;
    if (a[sort.key] > b[sort.key]) return sort.order === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div>
      <div>
        <label>Gender:</label>
        <select name="gender" onChange={handleFilter}>
          <option value="">All</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <label>Country:</label>
        <input type="text" name="country" onChange={handleFilter} />
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>ID</th>
            <th onClick={() => handleSort('name')}>Name</th>
            <th onClick={() => handleSort('age')}>Age</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.age}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <InfiniteScroll
        dataLength={users.length}
        next={fetchMoreUsers}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      />
    </div>
  );
};

export default UserList;
