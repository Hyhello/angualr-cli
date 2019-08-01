/**
 * 作者：Hyhello
 * 时间：2019-08-01
 * 描述：text
 */

export default ['$scope', '$resource', '$state', '$rootScope', function ($scope, $resource, $state, $rootScope) {
    const generateData = _ => {
        const data = [];
        for (let i = 1; i <= 15; i++) {
            data.push({
                key: i,
                label: `备选项 ${i}`,
                disabled: i % 4 === 0
            });
        }
        return data;
    };

    $scope.indeterminate = false;

    $scope.data = generateData();

    $scope.vModel = '你好';
}];
