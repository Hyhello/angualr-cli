/**
 * 作者：Hyhello
 * 时间：2019-08-01
 * 描述：text
 */

export default ['$scope', '$resource', '$state', '$rootScope', '$timeout', function ($scope, $resource, $state, $rootScope, $timeout) {
    $scope.data = [];
    $scope.column = [{
        title: 'Name',
        key: 'name',
        width: 100,
        fixed: 'left'
    },
    {
        title: 'Age',
        key: 'age',
        width: 100
    },
    {
        title: 'Province',
        key: 'province',
        width: 100
    },
    {
        title: 'City',
        key: 'city',
        width: 100
    },
    {
        title: 'Address',
        key: 'address',
        width: 200
    },
    {
        title: 'Postcode',
        key: 'zip',
        width: 100
    },
    {
        title: 'Action',
        key: 'action',
        fixed: 'right',
        width: '200',
        render: (h, params) => {
            return h('div', [
                h('Button', {
                    props: {
                        type: 'text',
                        size: 'small'
                    }
                }, 'View'),
                h('Button', {
                    props: {
                        type: 'text',
                        size: 'small'
                    }
                }, 'Edit')
            ]);
        }
    }];
    $timeout(() => {
        $scope.data = [
            {
                name: 'John Brown',
                age: 18,
                address: 'New York No. 1 Lake Park',
                province: 'America',
                city: 'New York',
                zip: 100000
            },
            {
                name: 'Jim Green',
                age: 24,
                address: 'Washington, D.C. No. 1 Lake Park',
                province: 'America',
                city: 'Washington, D.C.',
                zip: 100000
            },
            {
                name: 'Joe Black',
                age: 30,
                address: 'Sydney No. 1 Lake Park',
                province: 'Australian',
                city: 'Sydney',
                zip: 100000
            },
            {
                name: 'Jon Snow',
                age: 26,
                address: 'Ottawa No. 2 Lake Park',
                province: 'Canada',
                city: 'Ottawa',
                zip: 100000
            }
        ];
    }, 300000);
}];
