/**
 * 作者：Hyhello
 * 时间：2019-08-01
 * 描述：text
 */

export default ['$scope', '$resource', '$state', '$rootScope', '$timeout', function ($scope, $resource, $state, $rootScope, $timeout) {
    /** **************** transfer ************* */
    const generateData = _ => {
        const data = [];
        for (let i = 1; i <= 30; i++) {
            data.push({
                key: i,
                label: `备选项 ${i}`,
                disabled: i % 4 === 0
            });
        }
        return data;
    };

    // $scope.data = [];

    $scope.renderContent = function (item) {
        return `<div>${item.key} - ${item.label}</div>`;
    };
    $scope.vModel = [];
    $scope.data = [];
    console.log($scope.data);

    $timeout(() => {
        $scope.vModel = [1, 3, 4, 5, 7];
        $scope.data = generateData();
    }, 5000);

    /** **************** tree ************* */
}];
