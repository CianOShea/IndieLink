/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

const findMetadataIndices = (mem, item, i) => {
  if (/^---/.test(item)) {
    mem.push(i)
  }
  return mem
}

// const parseMetadata = ({ lines, metadataIndices }) => {
//   if (metadataIndices.length > 0) {
//     let metadata = lines.slice(metadataIndices[0] + 1, metadataIndices[1])
//     return safeLoad(metadata.join('\n'))
//   }
//   return {}
// }

const parseContent = ({ lines, metadataIndices }) => {
  if (metadataIndices.length > 0) {
    lines = lines.slice(metadataIndices[1] + 1, lines.length)
  }
  return lines.join('\n')
}

const parseMD = (contents) => {  
  const lines = contents.split('\n')
  let metadataIndices = lines.reduce(findMetadataIndices, [])
  // const metadata = parseMetadata({ lines, metadataIndices })
  if (metadataIndices.length > 2) {
    metadataIndices = []
  }
  const content = parseContent({ lines, metadataIndices })
  return { content }
}

export default parseMD
