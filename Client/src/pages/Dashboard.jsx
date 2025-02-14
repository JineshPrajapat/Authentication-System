import React, { useEffect, useState, useRef } from 'react';
import { useTable, usePagination, useSortBy } from 'react-table';
import userApi from '../api/userapi';
import { useDispatch } from 'react-redux';
import { logOut } from '../services/auth';

const INACTIVITY_TIMEOUT = 60 * 60 * 1000;

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [cursor, setCursor] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadMoreButton, setLoadMoreButton] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        name: '',
        date: '',
    });
    const [sortBy, setSortBy] = useState('');
    const [search, setSearch] = useState('');

    const inactivityTimer = useRef(null);
    const dispatch = useDispatch();

    const fetchUsers = async () => {

        const params = {
            name: search ?? "",
            status: filters.status,
            date: filters.date,
            sortBy
        };

        if (!search && !filters.status && !filters.date && !sortBy) {
            params.cursor = cursor;
        }

        setLoading(true);
        try {
            const response = await userApi.get('/user/allUsers', {
                params,
            });
            if (response.data.success === true) {

                if (!search && !filters.status && !filters.date && !sortBy) {
                    setUsers((prevUsers) => {
                        const existingUserIds = new Set(prevUsers.map((user) => user._id));

                        const uniqueUsers = response.data.users.filter(
                            (newUser) => !existingUserIds.has(newUser._id)
                        );

                        return [...prevUsers, ...uniqueUsers];
                    });
                }
                else {
                    setUsers(response.data.users);
                }
            }
        } catch (error) {
            if (error.status === 404) {
                setLoadMoreButton(false);
                setUsers([]);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, [cursor, filters, search, sortBy]);




    // logout timer
    const resetInactivityTimer = () => {
        if (inactivityTimer.current) {
            clearTimeout(inactivityTimer.current);
        }
        inactivityTimer.current = setTimeout(() => {
            dispatch(logOut());
            navigate('/');
        }, INACTIVITY_TIMEOUT);
    };

    // trigger eventlistener
    useEffect(() => {
        const activityEvents = ['mousemove', 'mousedown', 'keypress', 'scroll'];

        activityEvents.forEach((event) => {
            window.addEventListener(event, resetInactivityTimer);
        });

        // start timer on page reloads
        resetInactivityTimer();

        return () => {
            activityEvents.forEach((event) => {
                window.removeEventListener(event, resetInactivityTimer);
            });
            if (inactivityTimer.current) {
                clearTimeout(inactivityTimer.current);
            }
        };
    }, []);


    const data = React.useMemo(() => users, [users]);

    const columns = React.useMemo(
        () => [
            { Header: 'Name', accessor: 'name' },
            { Header: 'Email', accessor: 'email' },
            { Header: 'Status', accessor: 'status' },
            // { Header: 'Actions', accessor: 'actions', Cell: ({ row }) => <button className="text-blue-500 hover:text-blue-700">Edit</button> },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
        },
        useSortBy,
        usePagination
    );


    return (
        <div className="container mx-auto p-4">
            {/* Search and Filter */}
            <div className="flex flex-wrap items-center justify-between mb-6">
                <div className="flex gap-4">
                    <input
                        type="text"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search by name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <input
                        type="date"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filters.date}
                        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                    />
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        value={filters.status}
                    >
                        <option value="">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="PENDING_VERIFICATION">Inactive</option>
                    </select>
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setSortBy(e.target.value)}
                        value={sortBy}
                    >
                        <option value="desc">Sort by Newest</option>
                        <option value="asc">Sort by Oldest</option>
                    </select>
                </div>


                <div className="flex flex-row gap-4">
                    <button
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={() => setEditprofile(true)}
                    >
                        Edit Profile
                    </button>
                    <button
                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition duration-300 cursor-pointer"
                        onClick={() => {
                            dispatch(logOut());
                        }}
                    >
                        LogOut
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table {...getTableProps()} className="min-w-full table-auto">
                    <thead className="bg-gray-100">
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                                    >
                                        {column.render('Header')}
                                        <span>
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? ' 🔽'
                                                    : ' 🔼'
                                                : ''}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} className="border-b hover:bg-gray-50">
                                    {row.cells.map((cell) => {
                                        return (
                                            <td {...cell.getCellProps()} className="px-6 py-4 text-left text-sm text-gray-600">
                                                {cell.render('Cell')}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Load More */}
            {loadMoreButton &&
                <div className="flex justify-between items-center mt-4">
                    {loading ? (
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-4 border-t-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                            <span>Loading...</span>
                        </div>
                    ) : (
                        <button
                            onClick={() => { setCursor(users[users.length - 1]?._id); fetchUsers }}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Load More
                        </button>
                    )}
                </div>
            }


        </div>
    );
};

export default Dashboard;
