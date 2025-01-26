// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * 这个合约的功能：
 * 1. 接收一个CID（IPFS hash），并存储到 papers 列表里
 * 2. 记录是谁上传的、什么时候上传的
 * 3. 对外提供查看函数
 */

contract PaperStore {
    struct Paper {
        string ipfsCid;   // IPFS上对应文件的哈希
        address owner;    // 谁提交的
        uint256 timestamp; // 提交时间
    }

    Paper[] public papers; // 用一个数组来存所有paper

    /**
     * 把上传的paper CID存储到papers数组中
     */
    function submitPaper(string calldata _ipfsCid) external {
        Paper memory newPaper = Paper({
            ipfsCid: _ipfsCid,
            owner: msg.sender,
            timestamp: block.timestamp
        });
        papers.push(newPaper);
    }

    /**
     * 获取某个paper的信息
     */
    function getPaper(uint256 index) external view returns (string memory, address, uint256) {
        require(index < papers.length, "Invalid index");
        Paper memory p = papers[index];
        return (p.ipfsCid, p.owner, p.timestamp);
    }

    /**
     * 获取当前paper总数
     */
    function getPaperCount() external view returns (uint256) {
        return papers.length;
    }
}
